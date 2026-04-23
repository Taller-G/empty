# dasdasdd

A full-stack web application built with **Angular** (frontend), **Node.js + Express** (backend API), and **PostgreSQL** (database), following **Clean Architecture** principles throughout the backend.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Clean Architecture Layers](#clean-architecture-layers)
- [Prerequisites](#prerequisites)
- [Setup & Running](#setup--running)
- [API Reference](#api-reference)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)

---

## Tech Stack

| Layer    | Technology                       |
|----------|----------------------------------|
| Frontend | Angular 17 (standalone, signals) |
| Backend  | Node.js 18+, Express 4, TypeScript 5 |
| Database | PostgreSQL 15+                   |
| ORM/DB   | `pg` (raw SQL, no ORM)           |
| Validation | Zod (API), Angular Reactive Forms (UI) |
| Testing  | Jest (backend), Karma/Jasmine (frontend) |

---

## Project Structure

```
dasdasdd/
│
├── src/                        ← Backend (Clean Architecture)
│   ├── domain/                 ← Entities, Value Objects, Repository Interfaces
│   ├── application/            ← Use Cases, DTOs, Mappers
│   ├── infrastructure/         ← PostgreSQL client, Repository implementations, DI container
│   └── interfaces/             ← Express app, controllers, routes, middleware
│
├── angular/                    ← Angular frontend (standalone components)
│   └── src/
│       ├── app/
│       │   ├── core/           ← Models, services (HttpClient wrappers)
│       │   ├── features/       ← Feature modules (users/)
│       │   └── shared/         ← Shared components (not-found, etc.)
│       └── environments/
│
├── package.json                ← Backend dependencies
├── tsconfig.json               ← Backend TypeScript config
├── jest.config.js              ← Backend test config
├── .env.example                ← Environment variable template
└── README.md
```

---

## Clean Architecture Layers

The backend strictly follows Clean Architecture. Dependencies **only point inward**:

```
interfaces → application → domain
infrastructure → application → domain
```

### `src/domain/` — The Core
The heart of the application. **Zero external dependencies.**
- **Entities** (`User`) — business objects with identity and lifecycle
- **Value Objects** (`Email`, `UserId`) — immutable, equality by value
- **Repository Interfaces** (`IUserRepository`) — describe *what* persistence does, not *how*
- **Domain Services** (`UserUniquenessService`) — cross-entity business logic
- **Domain Errors** (`DomainError`, `NotFoundError`, `ConflictError`)

### `src/application/` — Use Cases
Orchestrates domain objects to fulfil user stories. Knows *what* to do, not *how*.
- **Use Cases** (`CreateUserUseCase`, `GetUserByIdUseCase`, …) — one class per use case with `execute(dto)` method
- **DTOs** (`UserDto`) — input/output contracts; use cases never return domain entities
- **Mappers** (`UserMapper`) — converts entities → DTOs

### `src/infrastructure/` — Adapters & I/O
All I/O lives here: databases, HTTP clients, queues.
- **`PostgresClient`** — pool-based pg wrapper with transaction support
- **`PostgresUserRepository`** — implements `IUserRepository` with raw SQL
- **`container.ts`** — Dependency Injection wiring (the only place `new` is called for infrastructure)
- **Migrations** — plain SQL files applied by the migration runner

### `src/interfaces/` — Entry Points
Translates HTTP requests into use case calls.
- **`server.ts`** — HTTP server entry point with graceful shutdown
- **`app.ts`** — Express app factory (middleware, routes, error handler)
- **`UserController`** — thin controller: validate → call use case → serialize
- **Middleware** — `errorHandler`, `requestLogger`, `validateBody`

---

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- **PostgreSQL** ≥ 15
- **Angular CLI** ≥ 17 (for frontend: `npm install -g @angular/cli`)

---

## Setup & Running

### 1. Clone & install dependencies

```bash
# Backend
npm install

# Frontend
cd angular && npm install && cd ..
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your PostgreSQL credentials
```

### 3. Create the database

```sql
-- In psql or your preferred client:
CREATE DATABASE dasdasdd_db;
```

### 4. Run database migrations

```bash
npm run db:migrate
```

### 5. Start the backend API

```bash
# Development (hot reload)
npm run dev

# Production build
npm run build && npm start
```

The API will be available at `http://localhost:3000/api/v1`.

### 6. Start the Angular frontend

```bash
cd angular
npm start          # runs ng serve with API proxy at http://localhost:4200
```

The Angular dev server proxies `/api` requests to the backend automatically (see `angular/proxy.conf.json`).

---

## API Reference

All endpoints are prefixed with `/api/v1`.

### Users

| Method | Path          | Description           | Body                          |
|--------|---------------|-----------------------|-------------------------------|
| POST   | `/users`      | Create a user         | `{ name, email }`             |
| GET    | `/users`      | List all users        | Query: `?onlyActive=true`     |
| GET    | `/users/:id`  | Get user by ID        | —                             |
| PATCH  | `/users/:id`  | Update user           | `{ name?, email? }`           |
| DELETE | `/users/:id`  | Delete user           | —                             |

### Health

| Method | Path              | Description            |
|--------|-------------------|------------------------|
| GET    | `/health`         | Liveness probe         |
| GET    | `/health/ready`   | Readiness probe (DB)   |

### Response format

All successful responses wrap data in a `data` key:
```json
{
  "data": {
    "id": "550e8400-...",
    "name": "Alice Smith",
    "email": "alice@example.com",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

Error responses:
```json
{
  "error": "NOT_FOUND",
  "message": "User with identifier \"...\" was not found."
}
```

---

## Available Scripts

### Backend

| Script               | Description                                |
|----------------------|--------------------------------------------|
| `npm run dev`        | Start dev server with hot reload           |
| `npm run build`      | Compile TypeScript to `dist/`              |
| `npm start`          | Run compiled production build              |
| `npm test`           | Run Jest tests                             |
| `npm run test:coverage` | Run tests with coverage report          |
| `npm run lint`       | ESLint check                               |
| `npm run lint:fix`   | ESLint auto-fix                            |
| `npm run format`     | Prettier format                            |
| `npm run typecheck`  | TypeScript type check (no emit)            |
| `npm run db:migrate` | Apply pending SQL migrations               |

### Frontend (`cd angular`)

| Script              | Description                                 |
|---------------------|---------------------------------------------|
| `npm start`         | Start Angular dev server (with API proxy)   |
| `npm run build`     | Production build                            |
| `npm test`          | Karma/Jasmine unit tests                    |
| `npm run lint`      | Angular ESLint                              |

---

## Environment Variables

See `.env.example` for the full list. Key variables:

| Variable       | Default               | Description                     |
|----------------|-----------------------|---------------------------------|
| `PORT`         | `3000`                | HTTP server port                |
| `NODE_ENV`     | `development`         | Environment mode                |
| `DB_HOST`      | `localhost`           | PostgreSQL host                 |
| `DB_PORT`      | `5432`                | PostgreSQL port                 |
| `DB_NAME`      | `dasdasdd_db`         | Database name                   |
| `DB_USER`      | `postgres`            | Database user                   |
| `DB_PASSWORD`  | *(required)*          | Database password               |
| `CORS_ORIGIN`  | `http://localhost:4200` | Allowed CORS origin           |
| `API_PREFIX`   | `/api/v1`             | Global API route prefix         |

---

## Architecture Decision Records

- **No ORM** — raw SQL keeps the infrastructure layer explicit and avoids leaking ORM types into the domain.
- **Singleton PostgresClient** — one pool per process for efficient connection reuse.
- **DTOs always** — use cases never return domain entities, ensuring the domain model can evolve freely.
- **Zod for HTTP validation** — schema errors are caught in the interfaces layer before reaching the application layer, keeping use cases clean.
- **Signals in Angular** — Angular 17 signals are used for reactive state in components instead of `BehaviorSubject` to align with the framework's future direction.
