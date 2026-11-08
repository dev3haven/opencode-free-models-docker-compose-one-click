# syntax=docker/dockerfile:1

# ---- Stage 1: dependencies from the upstream release tarball ----
FROM node:22.23.4-bookworm-slim AS deps
ARG UPSTREAM_REF
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
    DEBIAN_FRONTEND=noninteractive
WORKDIR /app
RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
        build-essential \
        python3 \
        curl \
        ca-certificates; \
    curl -fsSL "https://github.com/johngbl/qwenproxy/archive/${UPSTREAM_REF}.tar.gz" \
      | tar -xz --strip-components=1; \
    npm ci --omit=dev; \
    rm -rf bin; \
    npm cache clean --force; \
    rm -rf /var/lib/apt/lists/*

# ---- Stage 2: runtime, only what the compose file consumes ----
FROM node:22.23.4-bookworm-slim AS runtime
ENV NODE_ENV=production \
    PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
WORKDIR /app
COPY --from=deps --chown=1001:1001 /app /app
RUN set -eux; \
    groupadd --gid 1001 pwuser; \
    useradd --uid 1001 --gid pwuser -d /app --no-create-home --shell /usr/sbin/nologin pwuser; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        dumb-init=1.2.5-2 \
        'gosu=1.14-1*'; \
    rm -rf /var/lib/apt/lists/*; \
    ./node_modules/.bin/patchright install --with-deps --only-shell chromium; \
    rm -rf /var/lib/apt/lists/*; \
    mkdir -p /app/data/db /app/data/qwen_profiles /tmp/playwright; \
    chown -R 1001:1001 /ms-playwright /app/data /tmp/playwright; \
    chmod +x /app/docker-entrypoint.sh
