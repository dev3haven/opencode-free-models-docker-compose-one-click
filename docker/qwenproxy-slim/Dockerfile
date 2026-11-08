ARG UPSTREAM_REF=main

FROM node:22.23.4-bookworm-slim AS source
ARG UPSTREAM_REF
RUN apt-get update \
  && apt-get install -y --no-install-recommends git ca-certificates \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app
RUN git clone --depth 1 --branch "${UPSTREAM_REF}" https://github.com/johngbl/qwenproxy.git . \
  && rm -rf .git

FROM node:22.23.4-bookworm-slim AS deps
RUN apt-get update \
  && apt-get install -y --no-install-recommends build-essential python3 \
  && rm -rf /var/lib/apt/lists/*
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
WORKDIR /app
COPY --from=source /app/package.json /app/package-lock.json ./
RUN npm ci --omit=dev \
  && npm cache clean --force

FROM node:22.23.4-bookworm-slim AS runtime
RUN apt-get update \
  && apt-get install -y --no-install-recommends dumb-init=1.2.5-2 'gosu=1.14-1*' ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && groupadd --gid 1000 pwuser \
  && useradd --uid 1000 --gid pwuser --create-home --shell /bin/bash pwuser
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
RUN npx patchright install --with-deps chromium \
  && chown -R pwuser:pwuser /ms-playwright
COPY --from=source /app/docker-entrypoint.sh ./
COPY --from=source /app/bin ./bin
COPY --from=source /app/src ./src
RUN mkdir -p /app/data/db /app/data/qwen_profiles /tmp/playwright \
  && chown -R pwuser:pwuser /app /tmp/playwright \
  && chmod +x /app/docker-entrypoint.sh
VOLUME ["/app/data"]
EXPOSE 7936
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENTRYPOINT ["/usr/bin/dumb-init", "--", "/app/docker-entrypoint.sh"]
CMD ["npx", "tsx", "src/index.ts"]
