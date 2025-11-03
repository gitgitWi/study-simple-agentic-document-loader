FROM node:22-alpine AS web-builder

WORKDIR /app/web

COPY web/ ./
RUN corepack enable && pnpm install --frozen-lockfile
RUN pnpm build

FROM python:3.12-slim AS runner

ENV PATH="/root/.local/bin:${PATH}"

# Install uv CLI
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && curl -LsSf https://astral.sh/uv/install.sh | sh

WORKDIR /app

# Install Python dependencies with uv using the lockfile
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --group dev

# Copy application source
COPY . .

# Include pre-built web assets
COPY --from=web-builder /app/web/dist web/dist

EXPOSE 8000

CMD ["uv", "run", "task", "dev"]
