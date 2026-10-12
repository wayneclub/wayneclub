FROM node:22-bookworm-slim AS build

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /src/website
COPY website/package*.json ./
RUN npm ci --ignore-scripts
COPY website/ ./
RUN npm run build

FROM nginx:1.27-alpine

COPY --from=build /src/website/deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/website/index.html /usr/share/nginx/html/index.html
COPY --from=build /src/website/en /usr/share/nginx/html/en
COPY --from=build /src/website/zh-hant /usr/share/nginx/html/zh-hant
COPY --from=build /src/website/zh-hans /usr/share/nginx/html/zh-hans
COPY --from=build /src/website/assets /usr/share/nginx/html/assets
COPY --from=build /src/website/favicon.ico /usr/share/nginx/html/favicon.ico
COPY --from=build /src/website/robots.txt /usr/share/nginx/html/robots.txt
COPY --from=build /src/website/sitemap.xml /usr/share/nginx/html/sitemap.xml
COPY --from=build /src/website/llms.txt /usr/share/nginx/html/llms.txt

HEALTHCHECK --interval=1m --timeout=10s --retries=3 --start-period=15s \
    CMD wget -q --spider --timeout=5 http://127.0.0.1/ || exit 1

