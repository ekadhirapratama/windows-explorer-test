# Windows Explorer Web App

A modern, highly responsive Windows Explorer clone built with **Vue 3**, **ElysiaJS**, and **PostgreSQL**. This project demonstrates a robust implementation of a file management system using efficient algorithms for unlimited folder depth and a Clean Architecture pattern on the backend.

## 📸 Preview

![image](https://s.digitalservice.id/2wPHnX)

## 🏗️ Architecture

The project is structured as a **monorepo** using Bun workspaces, ensuring efficient dependency management and type safety across the full stack.

### Backend (Clean Architecture)
The API (`apps/api`) follows **Hexagonal (Clean) Architecture** principles to ensure separation of concerns and maintainability:
- **Domain Layer**: Core business entities and repository interfaces (independent of external frameworks).
- **Application Layer**: Use cases and services that orchestrate business logic.
- **Infrastructure Layer**: Concrete implementations of repositories (Drizzle ORM), database connections, and external adapters.
- **Presentation Layer**: HTTP routes and controllers using ElysiaJS.

### Frontend (Component-Based)
The Web app (`apps/web`) is built with **Vue 3 (Composition API)** and **Vite**:
- **State Management**: Custom Composables (`useExplorerState`) for lightweight, reactive state handling.
- **UI Components**: Modular, reusable components (FolderTree, ContentPanel, ActionToolbar) styled with scoped CSS.
- **Performance**: Lazy-loading folder structures to handle deep hierarchies efficiently.

## 🛠️ Technology Stack & Dependencies

*   **Runtime**: [Bun](https://bun.sh) (v1.3.9+) - Fast JavaScript runtime & package manager.
*   **Backend Framework**: [ElysiaJS](https://elysiajs.com/) - High-performance web framework for Bun.
*   **Frontend Framework**: [Vue 3](https://vuejs.org/) + [Vite](https://vitejs.dev/).
*   **Database**: [PostgreSQL](https://www.postgresql.org/) (v14+).
*   **ORM**: [Drizzle ORM](https://orm.drizzle.team/) - TypeScript-first ORM.
*   **Containerization**: [Docker](https://www.docker.com/) & Docker Compose.

## ✨ Features

-   **Dual-Panel Navigation**: Classic folder tree (left) and content grid (right).
-   **Recursive Folder Structure**: scalable design supporting unlimited nesting depth.
-   **File Operations**: Create Folder, Upload File, Rename, Delete, Cut, Copy, Paste.
-   **Search**: Global search functionality to quickly find files and folders.
-   **Sorting & Filtering**: Sort by Name/Type/Date and Filter by file type.
-   **"Quick Access" & "This PC"**: Categorized sidebar for easy navigation.

## 📋 Prerequisites

-   [Bun](https://bun.sh) v1.3.9 or higher
-   [Docker](https://www.docker.com/) and Docker Compose
-   PostgreSQL 14+ (optional, can use Docker)

## 🚀 Installation & Quick Start

### Option A: Manual Setup (using Bun)

1.  **Install Dependencies**
    ```bash
    bun install
    ```

2.  **Start Database (via Docker)**
    ```bash
    docker-compose up -d postgres
    ```

3.  **Run Migrations & Seed Data**
    ```bash
    cd apps/api
    bun run db:migrate
    bun run db:seed
    ```

4.  **Start Development Servers**
    From the root directory:
    ```bash
    bun run dev
    ```
    - Web: http://localhost:5173
    - API: http://localhost:3000

### Option B: Docker Deployment (Full Stack)

Run the entire stack (Database + API + Web) with a single command:

```bash
docker-compose up --build
```
Access the application at http://localhost:5173.

## 🧪 Testing Coverage

The project includes unit and integration tests.

```bash
# Run all tests
bun test

# Backend specific tests
cd apps/api && bun test

# Frontend specific tests
cd apps/web && bun test
```

> *Test coverage reports can be generated using `bun test --coverage` (if configured).*

## 📚 API Documentation

Interactive Swagger documentation is available when the API is running:
-   **Swagger UI**: http://localhost:3000/swagger

## 📁 Project Structure

```
windows-explorer-test/
├── apps/
│   ├── api/              # Backend (Elysia + Clean Arch)
│   │   ├── src/
│   │   │   ├── domain/           # Entities & Interfaces
│   │   │   ├── application/      # Services & Use Cases
│   │   │   ├── infrastructure/   # Drizzle ORM & DB
│   │   │   └── presentation/     # Routes
│   │   └── Dockerfile
│   └── web/              # Frontend (Vue 3 + Vite)
│       ├── src/
│       │   ├── components/       # UI Components
│       │   ├── composables/      # Shared State Logic
│       │   └── views/            # Main Views
│       └── Dockerfile
├── packages/
│   └── shared/           # Shared TypeScript Types
└── docker-compose.yml
```

## 📄 License
Private project for technical assessment.
