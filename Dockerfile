FROM node:22-bookworm-slim AS base

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.1.3 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

FROM base AS build

RUN pnpm install --frozen-lockfile

COPY tsconfig.json tsconfig.test.json ./
COPY src ./src

RUN pnpm build

FROM base AS dependencies

RUN pnpm install --frozen-lockfile --prod

FROM node:22-bookworm-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY --chown=node:node --from=dependencies /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node package.json ./
COPY --chown=node:node docs/specs ./docs/specs

USER node

EXPOSE 8080

CMD ["node", "dist/server.js"]
