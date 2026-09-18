/**
 * PocketLink 云端 CORS 代理。
 * 部署后把 Worker 地址填入应用设置中的“反向代理地址”，例如：
 * https://pocketlink-proxy.<account>.workers.dev/proxy
 */
const DEFAULT_ALLOWED_HOSTS = [
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
  "localhost"
];

function hostIsAllowed(hostname, env) {
  const configured = String(env?.ALLOWED_HOSTS || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  const allowedHosts = configured.length ? configured : DEFAULT_ALLOWED_HOSTS;
  const host = String(hostname || "").toLowerCase();
  return allowedHosts.some((item) => host === item || host.endsWith(`.${item}`));
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "*";
    const cors = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
      "Access-Control-Max-Age": "86400"
    };
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

    const incoming = new URL(request.url);
    if (incoming.pathname === "/health") {
      return Response.json({
        status: "ok",
        app: "PocketLink",
        version: "7",
        database: "browser-indexeddb",
        defaultApiConfigured: null,
        proxy: "ok"
      }, { headers: cors });
    }
    if (incoming.pathname !== "/proxy") {
      return Response.json({ error: "Not found" }, { status: 404, headers: cors });
    }
    const targetValue = incoming.searchParams.get("url");
    if (!targetValue) return Response.json({ error: "Missing url parameter" }, { status: 400, headers: cors });

    let target;
    try {
      target = new URL(targetValue);
    } catch {
      return Response.json({ error: "Invalid url parameter" }, { status: 400, headers: cors });
    }
    if (!["http:", "https:"].includes(target.protocol)) {
      return Response.json({ error: "Only http and https are allowed" }, { status: 400, headers: cors });
    }
    if (!hostIsAllowed(target.hostname, env)) {
      return Response.json(
        { error: `Target host is not allowlisted: ${target.hostname}` },
        { status: 403, headers: cors }
      );
    }

    const headers = new Headers(request.headers);
    headers.delete("host");
    headers.delete("origin");
    headers.delete("referer");
    headers.delete("cf-connecting-ip");
    headers.delete("cf-ipcountry");
    headers.delete("x-forwarded-for");
    headers.delete("x-real-ip");
    const upstream = await fetch(target, {
      method: request.method,
      headers,
      body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
      redirect: "follow"
    });
    const responseHeaders = new Headers(upstream.headers);
    for (const [name, value] of Object.entries(cors)) responseHeaders.set(name, value);
    responseHeaders.delete("content-security-policy");
    responseHeaders.set("Cache-Control", "no-store");
    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders
    });
  }
};
