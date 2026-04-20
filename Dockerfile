# =============================================================================
# Stage 1 – Build the MCP server (TypeScript → JavaScript)
# =============================================================================
FROM node:22-alpine AS mcp-build

WORKDIR /build/mcp-server

# Install dependencies (BuildKit cache mount avoids re-downloading)
COPY mcp-server/package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Compile TypeScript → JavaScript
COPY mcp-server/index.ts mcp-server/tsconfig.json mcp-server/veda.d.ts ./
RUN npm run build

# =============================================================================
# Stage 2a – Web app  (nginx already present in nginx:alpine, no apk needed)
#
#   docker build --target webapp -t vedic-chant:webapp .
#   docker run -p 8080:8080 vedic-chant:webapp
# =============================================================================
FROM nginx:1.27-alpine AS webapp

# Static files for the Vedic Chanting web app
WORKDIR /app/web
COPY index.html util.js styles.css Miriyam.ico ./
COPY LSystems.html LSystems.js ./
COPY ufoglif.html ufoglif.js ufoglif.css ufoglyf.js ./
COPY xml2json.min.js ./
COPY Veda.js ./
COPY ColorMaps/ ./ColorMaps/

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

# =============================================================================
# Stage 2b – MCP server  (stdio; launched by MCP client, not a daemon)
#
#   docker build --target mcp -t vedic-chant:mcp .
#   docker run --rm -i vedic-chant:mcp
# =============================================================================
FROM node:22-alpine AS mcp

WORKDIR /app

# Veda.js lives at /app/Veda.js.
# The compiled server resolves: /app/mcp-server/dist/../../Veda.js → /app/Veda.js
COPY Veda.js ./

WORKDIR /app/mcp-server

# Production runtime deps only
COPY mcp-server/package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Compiled output from the build stage
COPY --from=mcp-build /build/mcp-server/dist ./dist

# MCP over stdio — no port exposed
CMD ["node", "dist/index.js"]

