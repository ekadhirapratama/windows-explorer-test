# Build stage
FROM oven/bun:1.3.9-alpine AS builder

WORKDIR /app

# Copy root and package files
COPY package.json ./

# Copy shared package
COPY packages/shared/package.json ./packages/shared/package.json
COPY packages/shared ./packages/shared

# Copy web package
COPY apps/web/package.json ./apps/web/package.json
COPY apps/web ./apps/web

# Install all dependencies from the monorepo root
RUN bun install

# Build the frontend
RUN cd apps/web && bun run build

# Production stage with nginx
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Copy nginx configuration
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
