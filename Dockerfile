ARG BASE_IMAGE=node:24-bookworm-slim
FROM ${BASE_IMAGE}

WORKDIR /app

ENV FAME_GATEWAY_HOST=0.0.0.0
ENV FAME_GATEWAY_PORT=5191
ENV FAME_WORKBENCH_PORT=5178
ENV FAME_OPEN_BROWSER=0
ENV FAME_SKIP_INSTALL=1

COPY package.json ./
COPY workbench/package.json workbench/package-lock.json ./workbench/
RUN npm ci --prefix workbench

COPY . .
RUN npm run generate:all && npm run build

EXPOSE 5178 5191

CMD ["node", "scripts/start-all.mjs"]
