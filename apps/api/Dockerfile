# Build stage
FROM oven/bun:1.3.9-alpine AS builder

WORKDIR /app

# Copy root and package files
COPY package.json ./

# Copy shared package
COPY packages/shared/package.json ./packages/shared/package.json
COPY packages/shared ./packages/shared

# Copy api package
COPY apps/api/package.json ./apps/api/package.json
COPY apps/api ./apps/api

# Install all dependencies from the monorepo root
RUN bun install

# Production stage
FROM oven/bun:1.3.9-alpine

WORKDIR /app

# Copy everything from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api ./apps/api

# Set working directory to API
WORKDIR /app/apps/api

# Expose port
EXPOSE 3000

# Health check (without wget)
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD bun -e "fetch('http://localhost:3000/health').then(r => r.ok ? process.exit(0) : process.exit(1))"

# Start the application
CMD ["bun", "src/index.ts"]
