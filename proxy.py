#!/usr/bin/env python3
"""PocketLink 本地静态服务器与 CORS 代理，仅使用 Python 标准库。"""

from __future__ import annotations

import argparse
import json
import mimetypes
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


MAX_REQUEST_BODY = 32 * 1024 * 1024
APP_VERSION = "5"
DEFAULT_ALLOWED_HOSTS = {
    "openrouter.ai",
    "api.deepseek.com",
    "api.openai.com",
    "api.anthropic.com",
    "generativelanguage.googleapis.com",
    "open.bigmodel.cn",
    "dashscope.aliyuncs.com",
    "api.moonshot.cn",
    "api.minimax.chat",
    "127.0.0.1",
    "localhost",
}


class PocketLinkHandler(SimpleHTTPRequestHandler):
    """同源提供 PocketLink 文件，并转发 /proxy 请求。"""

    server_version = "PocketLinkProxy/1.0"
    allowed_hosts = DEFAULT_ALLOWED_HOSTS

    def end_headers(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_OPTIONS(self) -> None:
        if urllib.parse.urlparse(self.path).path == "/proxy":
            self.send_response(HTTPStatus.NO_CONTENT)
            self.end_headers()
            return
        super().do_OPTIONS()

    def do_GET(self) -> None:
        path = urllib.parse.urlparse(self.path).path
        if path == "/health":
            self.write_health()
            return
        if path == "/proxy":
            self.handle_proxy("GET")
            return
        super().do_GET()

    def do_POST(self) -> None:
        if urllib.parse.urlparse(self.path).path == "/proxy":
            self.handle_proxy("POST")
            return
        self.send_error(HTTPStatus.METHOD_NOT_ALLOWED, "Only /proxy accepts POST")

    def do_PUT(self) -> None:
        if urllib.parse.urlparse(self.path).path == "/proxy":
            self.handle_proxy("PUT")
            return
        self.send_error(HTTPStatus.METHOD_NOT_ALLOWED, "Only /proxy accepts PUT")

    def do_PATCH(self) -> None:
        if urllib.parse.urlparse(self.path).path == "/proxy":
            self.handle_proxy("PATCH")
            return
        self.send_error(HTTPStatus.METHOD_NOT_ALLOWED, "Only /proxy accepts PATCH")

    def do_DELETE(self) -> None:
        if urllib.parse.urlparse(self.path).path == "/proxy":
            self.handle_proxy("DELETE")
            return
        self.send_error(HTTPStatus.METHOD_NOT_ALLOWED, "Only /proxy accepts DELETE")

    def handle_proxy(self, method: str) -> None:
        parsed = urllib.parse.urlparse(self.path)
        query = urllib.parse.parse_qs(parsed.query)
        target = (query.get("url") or [""])[0].strip()
        if not target:
            self.write_json_error(HTTPStatus.BAD_REQUEST, "缺少 url 参数")
            return

        target_parsed = urllib.parse.urlparse(target)
        if target_parsed.scheme not in {"http", "https"} or not target_parsed.netloc:
            self.write_json_error(HTTPStatus.BAD_REQUEST, "只允许转发 http 或 https 地址")
            return
        hostname = (target_parsed.hostname or "").lower()
        if not self.host_is_allowed(hostname):
            self.write_json_error(
                HTTPStatus.FORBIDDEN,
                f"目标域名不在代理白名单中：{hostname or 'unknown'}",
            )
            return

        try:
            body = self.read_request_body() if method in {"POST", "PUT", "PATCH", "DELETE"} else None
            headers = self.forward_headers()
            request = urllib.request.Request(target, data=body, headers=headers, method=method)
            with urllib.request.urlopen(request, timeout=180) as upstream:
                self.send_response(upstream.status)
                for name, value in upstream.headers.items():
                    if name.lower() in {
                        "connection",
                        "content-length",
                        "content-encoding",
                        "transfer-encoding",
                        "access-control-allow-origin",
                        "access-control-allow-headers",
                        "access-control-allow-methods",
                    }:
                        continue
                    self.send_header(name, value)
                self.end_headers()
                while True:
                    chunk = upstream.read(64 * 1024)
                    if not chunk:
                        break
                    self.wfile.write(chunk)
        except urllib.error.HTTPError as error:
            payload = error.read()
            self.send_response(error.code)
            content_type = error.headers.get("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
        except Exception as error:  # noqa: BLE001 - 本地代理需要把上游错误返回给前端。
            self.write_json_error(HTTPStatus.BAD_GATEWAY, f"代理请求失败：{error}")

    def read_request_body(self) -> bytes:
        length = int(self.headers.get("Content-Length", "0") or 0)
        if length > MAX_REQUEST_BODY:
            raise ValueError("请求体超过 32 MB 限制")
        return self.rfile.read(length)

    def host_is_allowed(self, hostname: str) -> bool:
        return any(
            hostname == allowed or hostname.endswith("." + allowed)
            for allowed in self.allowed_hosts
        )

    def forward_headers(self) -> dict[str, str]:
        ignored = {
            "host",
            "content-length",
            "connection",
            "origin",
            "referer",
            "accept-encoding",
            "access-control-request-headers",
            "access-control-request-method",
        }
        return {
            name: value
            for name, value in self.headers.items()
            if name.lower() not in ignored
        }

    def write_json_error(self, status: HTTPStatus, message: str) -> None:
        payload = json.dumps({"error": message}, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def write_health(self) -> None:
        payload = json.dumps(
            {
                "status": "ok",
                "app": "PocketLink",
                "version": APP_VERSION,
                "database": "browser-indexeddb",
                "defaultApiConfigured": None,
                "proxy": "ok",
                "allowedHosts": sorted(self.allowed_hosts),
            },
            ensure_ascii=False,
        ).encode("utf-8")
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def log_message(self, fmt: str, *args: object) -> None:
        sys.stderr.write("[PocketLink] " + fmt % args + "\n")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="PocketLink 本地服务器与 CORS 代理")
    parser.add_argument("--host", default="127.0.0.1", help="监听地址，默认仅本机")
    parser.add_argument("--port", type=int, default=8787, help="监听端口，默认 8787")
    parser.add_argument(
        "--directory",
        default=os.path.dirname(os.path.abspath(__file__)),
        help="静态文件目录，默认当前脚本所在目录",
    )
    parser.add_argument(
        "--allowed-hosts",
        default=os.environ.get("ALLOWED_HOSTS", ""),
        help="逗号分隔的代理白名单，默认使用内置模型 API 域名",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    directory = os.path.abspath(args.directory)
    os.chdir(directory)
    mimetypes.add_type("application/javascript", ".js")
    mimetypes.add_type("text/css", ".css")
    if args.allowed_hosts.strip():
        PocketLinkHandler.allowed_hosts = {
            host.strip().lower()
            for host in args.allowed_hosts.split(",")
            if host.strip()
        }
    server = ThreadingHTTPServer((args.host, args.port), PocketLinkHandler)
    print(f"PocketLink: http://{args.host}:{args.port}/index.html")
    print(f"Proxy:      http://{args.host}:{args.port}/proxy?url=<encoded-url>")
    print("按 Ctrl+C 停止。")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n已停止。")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
