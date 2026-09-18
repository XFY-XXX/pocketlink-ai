# PocketLink 云端部署

PocketLink 是纯静态 PWA，不需要构建。把整个 `D:\PocketLink` 目录上传到任意静态托管即可。

也可以直接运行：

```powershell
.\deploy.ps1 -ProjectName pocketlink -WorkerName pocketlink-proxy
```

部署后打开 `/health` 检查应用版本与浏览器数据库能力。

## Cloudflare Pages

1. 登录 Cloudflare Dashboard。
2. 进入 Workers & Pages，新建 Pages 项目。
3. 直接上传 `D:\PocketLink` 目录，或连接包含该目录的 Git 仓库。
4. 构建命令留空。
5. 输出目录填写 `/`。
6. 部署后用手机打开分配到的 `https://...pages.dev` 地址，浏览器菜单选择“添加到主屏幕”。

## Cloudflare Worker CORS 代理

浏览器直接请求部分模型接口时会被 CORS 拦截。部署 Worker：

```powershell
npx wrangler deploy cloudflare-worker.js --name pocketlink-proxy
```

然后在 PocketLink 中填写：

```text
设置 → 代理 → 反向代理地址
https://pocketlink-proxy.<account>.workers.dev/proxy
```

## GitHub Pages

1. 新建 GitHub 仓库。
2. 上传 `D:\PocketLink` 中的全部文件。
3. 在仓库 Settings → Pages 中选择从 `main` 分支根目录发布。
4. 手机打开 Pages 地址并添加到主屏幕。

## 手机使用建议

- iOS Safari 或 Android Chrome 打开云端地址后，使用“添加到主屏幕”。
- 麦克风、摄像头和相册权限由浏览器按网站域名管理。
- 云端 HTTPS 页面可以直接使用 PWA、录音、摄像头和语音识别能力。
- API Key 只保存在当前浏览器的 IndexedDB，不会随静态文件上传。
