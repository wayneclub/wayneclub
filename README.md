# Wayne Club

[![Website](https://img.shields.io/badge/website-wayneclub.com-111827?style=flat-square)](https://wayneclub.com)
[![Deploy](https://img.shields.io/github/actions/workflow/status/wayneclub/wayneclub/container.yml?branch=main&style=flat-square&label=deploy)](https://github.com/wayneclub/wayneclub/actions/workflows/container.yml)

**Live website:** [wayneclub.com](https://wayneclub.com)<br>
**繁體中文:** [README.zh-TW.md](README.zh-TW.md)

Wayne Club is a static, trilingual personal website for Ting-Long (Wayne) Wei. It presents backend engineering, AI services, cloud infrastructure and open-source projects through an Apple-inspired interface.

## Languages

- English: `/` and `/en/`
- Traditional Chinese: `/zh-hant/`
- Simplified Chinese: `/zh-hans/`

The site supports locale-aware content, light/dark appearance preferences, reduced motion, keyboard navigation and consent-gated analytics.

## Production deployment

Production is container-first:

1. A push to `main` starts GitHub Actions.
2. Actions checks, builds and tests the website Docker image.
3. The verified image is published as `ghcr.io/wayneclub/wayneclub:latest`.
4. `/home/ubuntu/docker/docker-compose.yml` runs that image.
5. Watchtower updates the labeled container when a new image is available.

The production host does not serve files from the repository's `website/` directory and does not mount the website source into Nginx. Subscription and rule files are kept separately under `/home/ubuntu/appdata/wayneclub-runtime` and mounted only as runtime data.

## Repository layout

- `website/` — source HTML, translations, assets, build scripts and tests
- `Dockerfile` — reproducible multi-stage Nginx image build
- `.github/workflows/container.yml` — test and GHCR deployment pipeline
- `README.zh-TW.md` — Traditional Chinese project overview

## Local development

```sh
cd website
npm ci
npm run build
npm run check
npm test
```

To preview the generated files with Docker from the repository root:

```sh
docker build -t wayneclub-website .
docker run --rm -p 8080:80 wayneclub-website
```

For implementation details and the complete verification matrix, see [`website/README.md`](website/README.md).
