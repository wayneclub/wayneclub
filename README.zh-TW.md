# Wayne Club

[![網站](https://img.shields.io/badge/website-wayneclub.com-111827?style=flat-square)](https://wayneclub.com)
[![部署](https://img.shields.io/github/actions/workflow/status/wayneclub/wayneclub/container.yml?branch=main&style=flat-square&label=deploy)](https://github.com/wayneclub/wayneclub/actions/workflows/container.yml)

**網站：** [wayneclub.com](https://wayneclub.com)<br>
**English:** [README.md](README.md)

Wayne Club 是 Ting-Long（Wayne）Wei 的靜態三語個人網站，介紹後端工程、AI 服務、雲端基礎設施與開源專案，並以 Apple 風格的介面呈現。

## 語言版本

- English：`/` 與 `/en/`
- 繁體中文：`/zh-hant/`
- 简体中文：`/zh-hans/`

網站支援依語系顯示內容、明暗外觀偏好、減少動態效果、鍵盤操作，以及取得同意後才啟用的分析功能。

## 正式環境部署

正式環境採用 Docker container-first 架構：

1. 推送到 `main` 後啟動 GitHub Actions。
2. Actions 執行檢查、建置與測試。
3. 驗證通過後發布 `ghcr.io/wayneclub/wayneclub:latest`。
4. `/home/ubuntu/docker/docker-compose.yml` 使用該 image 執行網站。
5. Watchtower 偵測到新 image 後自動更新標記的 container。

正式主機不會直接從 repository 的 `website/` 資料夾提供網站，也不會把 website 原始碼掛載進 Nginx。訂閱與規則檔案獨立放在 `/home/ubuntu/appdata/wayneclub-runtime`，只以 runtime data 形式掛載。

## Repository 結構

- `website/` — 網站原始 HTML、翻譯、素材、建置腳本與測試
- `Dockerfile` — 可重現的 multi-stage Nginx image 建置
- `.github/workflows/container.yml` — 測試與 GHCR 部署流程
- `README.md` — 預設英文專案說明

## 本機開發

```sh
cd website
npm ci
npm run build
npm run check
npm test
```

若要從 repository 根目錄用 Docker 預覽建置結果：

```sh
docker build -t wayneclub-website .
docker run --rm -p 8080:80 wayneclub-website
```

完整實作與驗證項目請參考 [`website/README.md`](website/README.md)。
