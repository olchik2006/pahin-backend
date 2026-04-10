# pahin-backend

![CI](https://github.com/olchik2006/pahin-backend/actions/workflows/ci.yml/badge.svg)

REST API for the Pahin platform — a volunteer tree-planting initiative that allows users to register trees, track their location on an interactive map, and receive digital certificates for their contribution.

## Tech Stack

- **Node.js** + **Express.js**
- **PostgreSQL** — primary database
- **Docker** + **Docker Compose** — containerization
- **JWT** — authentication
- **Joi** — request validation
- **ESLint** + **Prettier** — code quality

## Prerequisites

### With Docker (recommended)
- Docker Desktop v4+

### Without Docker
- Node.js v20+
- PostgreSQL v15+

## Getting Started

### Run with Docker (recommended)

1. Clone the repository

```bash
git clone https://github.com/olchik2006/pahin-backend.git
cd pahin-backend
```

2. Create a `.env` file based on `.env.example`

```bash
cp .env.example .env
```

3. Start all services

```bash
docker-compose up --build
```

The server will be running at `http://localhost:5000`

> **Note:** On first run, Docker will automatically initialize the database schema from `docker/schema.sql`

### Run locally (without Docker)

1. Clone the repository and install dependencies

```bash
git clone https://github.com/olchik2006/pahin-backend.git
cd pahin-backend
npm install
```

2. Create a `.env` file based on `.env.example` and fill in the values

```bash
cp .env.example .env
```

3. Set up the database — run `docker/schema.sql` against your PostgreSQL instance in pgAdmin

4. Start the development server

```bash
npm run dev
```

The server will be running at `http://localhost:5000`

## Environment Variables

| Variable | Description |
| --- | --- |
| `PORT` | Port the server runs on (default: 5000) |
| `NODE_ENV` | Environment (`development` / `production`) |
| `DB_HOST` | Database host (`postgres` for Docker, `localhost` for local) |
| `DB_PORT` | Database port (default: 5432) |
| `DB_USER` | PostgreSQL user |
| `DB_PASSWORD` | PostgreSQL password |
| `DB_NAME` | PostgreSQL database name |
| `JWT_SECRET` | Secret key for signing JWT tokens |

## Project Structure
src/
├── config/ # Database connection and configuration
├── controllers/ # Request handlers
├── middleware/ # Validation, error handling
├── models/ # Database queries
├── routes/ # API route definitions
├── utils/ # Utility functions and custom errors
└── index.js # Application entry point
docker/
└── schema.sql # Database schema (auto-applied in Docker)

## API Reference

### Auth

| Method | Endpoint | Description | Auth required |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Log in | No |
| POST | `/api/auth/logout` | Log out | Yes |

### Users

| Method | Endpoint | Description | Auth required |
| --- | --- | --- | --- |
| GET | `/api/users/me` | Get current user profile | Yes |
| PUT | `/api/users/me` | Update profile | Yes |
| GET | `/api/users/me/trees` | Get user's planted trees | Yes |
| GET | `/api/users/me/certificates` | Get user's certificates | Yes |

### Trees

| Method | Endpoint | Description | Auth required |
| --- | --- | --- | --- |
| GET | `/api/trees` | Get all trees (map data) | No |
| GET | `/api/trees/species` | Get available tree species | No |
| GET | `/api/trees/:id` | Get tree by ID | No |
| POST | `/api/trees` | Plant a tree | Yes |
| DELETE | `/api/trees/:id` | Delete a tree | Yes |

## Scripts

```bash
npm run dev       # Start development server with hot reload
npm run start     # Start production server
npm run lint      # Run ESLint
npm run lint:fix  # Run ESLint and auto-fix issues
npm run format    # Format code with Prettier
```
