# Windows Explorer Web App

A Windows Explorer-like web application built with Vue 3, Elysia, and PostgreSQL.

## 🏗️ Architecture

This is a **monorepo** project using Bun workspaces with:

- **Backend (API)**: Elysia + TypeScript + Drizzle ORM + PostgreSQL
- **Frontend (Web)**: Vue 3 + Vite + TypeScript
- **Shared**: Common TypeScript types

The backend follows **Hexagonal/Clean Architecture** with:
- Domain Layer (entities, repository interfaces)
- Application Layer (services, use cases)
- Infrastructure Layer (database, repository implementations)
- Presentation Layer (HTTP routes)

## 📋 Prerequisites

- [Bun](https://bun.sh) v1.3.9 or higher
- [Docker](https://www.docker.com/) and Docker Compose
- PostgreSQL 14+ (optional, can use Docker)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
bun install
```

### 2. Start PostgreSQL

```bash
# Using Docker (recommended)
docker-compose up -d
```

### 3. Run Database Migrations

```bash
# Generate migration files
cd apps/api
bun drizzle-kit generate

# Run migrations
bun run db:migrate
```

### 4. Seed Database (Phase 1)

```bash
bun run db:seed
```

### 5. Start Development Servers

```bash
# From project root - starts both API and Web
bun run dev
```

## 🐳 Docker Deployment

### Full Stack (Recommended)

Run all services (PostgreSQL, API, Web) with a single command:

```bash
# Build and start all services (PostgreSQL + API + Web)
docker-compose up --build

# Run in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Reset database (removes volumes)
docker-compose down -v
```

### Development Mode (Local)

For local development with hot reload:

```bash
# Terminal 1: Start PostgreSQL only
docker-compose up postgres

# Terminal 2: Start API with hot reload
cd apps/api && bun --watch src/index.ts

# Terminal 3: Start Web with hot reload
cd apps/web && bun run dev
```

## 📁 Project Structure

```
windows-explorer-test/
├── apps/
│   ├── api/              # Backend (Elysia + TypeScript)
│   │   ├── src/
│   │   │   ├── domain/           # Business logic
│   │   │   ├── application/      # Services
│   │   │   ├── infrastructure/   # Database, repositories
│   │   │   └── presentation/     # HTTP routes
│   │   ├── Dockerfile
│   │   └── package.json
│   └── web/              # Frontend (Vue 3 + Vite)
│       ├── src/
│       │   ├── components/
│       │   ├── composables/
│       │   ├── services/
│       │   └── types/
│       ├── Dockerfile
│       └── package.json
├── packages/
│   └── shared/           # Shared TypeScript types
└── docker-compose.yml
```

## 🧪 Testing

```bash
# Run all tests
bun test

# Backend tests
cd apps/api && bun test

# Frontend tests
cd apps/web && bun test

# E2E tests
cd apps/web && bun run test:e2e
```

## 📚 API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:3000/swagger

## 🔧 Environment Variables

Copy `.env.example` to `.env` and adjust as needed

## 📄 License

Private project for technical assessment.
