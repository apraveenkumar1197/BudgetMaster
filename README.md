# BudgetMaster

A personal finance management application with a Laravel REST API backend and a React SPA frontend.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
- [Docker](#docker)
- [Jenkins CI/CD](#jenkins-cicd)

---

## Features

| Module | Description |
|---|---|
| Expense | Add / edit / delete expenses; daily view; individual reports |
| Income | Add / edit / delete income; monthly view; individual reports |
| Budget | Plan budget, review vs actuals, copy from previous month, reorder |
| Tally | Monthly reconciliation summary |
| Dues & Returns | Track money lent / owed and repayments |
| Credit Card | Credit card expense tracking |
| Investments | Investment entries with monthly sub-category breakdown |
| Loans | Loan management |
| Storage | Fund / account balances with transfer support and reports |
| Dashboard | Charts and summary (Dashi) |

---

## Architecture

```
┌─────────────────────┐        ┌──────────────────────────────┐
│   React SPA         │        │   Laravel API                │
│   (MUI v5)          │─HTTP──▶│   (PHP 8.2 / Laravel 9)      │
│   Port 3000         │        │   Port 8080                  │
└─────────────────────┘        └──────────┬───────────────────┘
                                          │
                              ┌───────────┴──────────┐
                              │  MySQL               │  ← users / auth / OAuth
                              │  Per-user SQLite DB  │  ← all financial data
                              └──────────────────────┘
```

- **Auth**: OTP-based login (no passwords) via Laravel Passport (OAuth 2.0).
- **Data isolation**: Every user gets their own SQLite database file (`md5(email).db`). No row-level filtering needed.
- **Services layer**: Controllers are thin; all business logic lives in `app/Services/`.

---

## Project Structure

```
BudgetMaster/
├── laravel/                # Laravel 9 backend
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/Sqlite/  # Per-user SQLite models
│   │   ├── Services/       # Business logic
│   │   ├── Enum/
│   │   └── Validators/
│   ├── database/migrations/
│   ├── routes/api.php
│   └── Dockerfile
│
├── reactjs/                # React 18 frontend
│   ├── src/
│   │   ├── components/     # UI components (Budget, Expense, Income…)
│   │   ├── repo/           # API call layer (one file per domain)
│   │   ├── providers/      # LocalStorage, auth helpers
│   │   └── functionalities/
│   └── Dockerfile
│
├── docker/
│   └── nginx/
│       └── laravel.conf    # Nginx config for the API container
├── docker-compose.yml      # Local / dev compose
├── docker-compose.prod.yml # Production overlay (uses registry images)
├── Jenkinsfile             # CI/CD pipeline
└── .env.example            # Environment variable template
```

---

## Local Development

### Prerequisites

- Docker Desktop
- Git

### Steps

```bash
# 1. Clone
git clone <repo-url>
cd BudgetMaster

# 2. Create .env from template
cp .env.example .env
# Edit .env — fill in APP_KEY, OAUTH credentials

# 3. Generate an APP_KEY if you don't have one
docker run --rm -v "$(pwd)/laravel":/app -w /app php:8.2-cli \
  php artisan key:generate --show
# Copy the output into .env → APP_KEY=

# 4. Start all services
docker compose up -d --build

# 5. Run Laravel migrations on first start
docker exec budgetmaster_php php artisan migrate --force
docker exec budgetmaster_php php artisan passport:install
```

| Service | URL |
|---|---|
| React frontend | http://localhost:3000 |
| Laravel API | http://localhost:8080/api |

---

## Docker

### Services

| Container | Image | Exposed port |
|---|---|---|
| `budgetmaster_db` | mysql:8.0 | internal only |
| `budgetmaster_php` | php:8.2-fpm (local build) | internal only |
| `budgetmaster_api` | nginx:alpine | 8080 |
| `budgetmaster_frontend` | nginx:alpine (React build) | 3000 |

### Useful commands

```bash
# Start
docker compose up -d

# Rebuild after code changes
docker compose up -d --build

# Stop
docker compose down

# View logs
docker compose logs -f laravel-php
docker compose logs -f react-app

# Run artisan commands
docker exec budgetmaster_php php artisan <command>

# Production mode (uses registry images instead of local build)
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Volumes

| Volume | Contents |
|---|---|
| `db_data` | MySQL data |
| `laravel_storage` | Laravel logs, cache, uploaded files |
| `sqlite_dbs` | Per-user SQLite database files |

---

## Jenkins CI/CD

### Pipeline overview

```
Checkout → Test (parallel) → Build → Push → Deploy
               ├─ Laravel PHPUnit
               └─ React Jest
```

| Stage | What happens |
|---|---|
| **Checkout** | Pulls source from SCM |
| **Test** | Runs PHPUnit and Jest each inside a throwaway Docker container (no PHP/Node needed on the agent) |
| **Build** | Builds `budgetmaster-api` and `budgetmaster-frontend` Docker images tagged with the build number and `latest` |
| **Push** | Logs in to the registry and pushes both tags |
| **Deploy** | SCPs compose files + a generated `.env` to the server, then pulls the new images and restarts services with zero-downtime `docker compose up -d` |

---

### Prerequisites on the Jenkins server

- Jenkins 2.x with the following plugins:
  - **Pipeline** (`workflow-aggregator`)
  - **Git**
  - **Credentials Binding** (`credentials-binding`)
  - **SSH Agent** (`ssh-agent`)
  - **Docker Pipeline** (`docker-workflow`) *(optional, for `docker` DSL)*
- Docker installed and the `jenkins` user added to the `docker` group:
  ```bash
  sudo usermod -aG docker jenkins
  sudo systemctl restart jenkins
  ```

---

### Step 1 — Global environment variables

**Manage Jenkins → System → Global properties → Environment variables**

| Name | Example value | Description |
|---|---|---|
| `DOCKER_REGISTRY` | `docker.io/yourusername` | Registry prefix for image names |
| `DEPLOY_HOST` | `192.168.1.100` | IP / hostname of the production server |

---

### Step 2 — Credentials

**Manage Jenkins → Credentials → System → Global credentials → Add Credential**

Create each of the following:

#### Docker registry login

| Field | Value |
|---|---|
| Kind | Username with password |
| ID | `docker-registry-credentials` |
| Username | Your Docker Hub / registry username |
| Password | Your Docker Hub / registry password or access token |

#### SSH key for the deployment server

| Field | Value |
|---|---|
| Kind | SSH Username with private key |
| ID | `deploy-server-ssh` |
| Username | The SSH user on the server (e.g. `ubuntu`) |
| Private key | Paste the private key content (the server's `~/.ssh/authorized_keys` must contain the matching public key) |

#### Laravel secrets

| Kind | ID | Description |
|---|---|---|
| Secret text | `laravel-app-key` | Laravel `APP_KEY` (output of `php artisan key:generate --show`) |
| Secret text | `laravel-oauth-client-id` | Passport personal access client ID |
| Secret text | `laravel-oauth-client-secret` | Passport personal access client secret |
| Secret text | `db-root-password` | MySQL root password |
| Secret text | `db-password` | MySQL app-user password |
| Secret text | `react-api-base-url` | Full URL of the API, e.g. `http://yourdomain.com:8080/api/` |

---

### Step 3 — Create the Jenkins job

1. **New Item → Pipeline**
2. Under **Pipeline**, set **Definition** to `Pipeline script from SCM`
3. Set **SCM** to `Git` and enter your repository URL
4. Set **Script Path** to `Jenkinsfile`
5. Save

---

### Step 4 — First-time server setup

On the deployment server, run once before the first pipeline execution:

```bash
# Install Docker
curl -fsSL https://get.docker.com | sh

# Add your deploy user to the docker group
sudo usermod -aG docker $USER

# Create the deploy directory
mkdir -p ~/budgetmaster
```

Obtain Passport credentials after the first successful deploy:

```bash
ssh user@your-server
cd ~/budgetmaster
docker exec budgetmaster_php php artisan passport:install
# Copy the "Personal access client" ID and secret into Jenkins credentials
# (laravel-oauth-client-id and laravel-oauth-client-secret)
```

---

### Step 5 — Trigger a build

```
Jenkins → your-job → Build Now
```

Or configure a webhook in your Git provider to trigger on push to `master`.

---

### Environment variables reference

All variables consumed by the pipeline are sourced from Jenkins credentials or global env vars. None are hardcoded in `Jenkinsfile`.

| Variable | Source | Used in stage |
|---|---|---|
| `DOCKER_REGISTRY` | Global env var | Build, Push, Deploy |
| `DEPLOY_HOST` | Global env var | Deploy |
| `DOCKER_USER` / `DOCKER_PASS` | Credential `docker-registry-credentials` | Push, Deploy |
| `SSH_KEY` / `SSH_USER` | Credential `deploy-server-ssh` | Deploy |
| `APP_KEY` | Credential `laravel-app-key` | Deploy |
| `OAUTH_CLIENT_ID` | Credential `laravel-oauth-client-id` | Deploy |
| `OAUTH_CLIENT_SECRET` | Credential `laravel-oauth-client-secret` | Deploy |
| `DB_ROOT_PASSWORD` | Credential `db-root-password` | Deploy |
| `DB_PASSWORD` | Credential `db-password` | Deploy |
| `REACT_APP_API_BASE_URL` | Credential `react-api-base-url` | Build, Deploy |

---

### Troubleshooting

**`docker: permission denied`**
The `jenkins` user is not in the `docker` group. Run `sudo usermod -aG docker jenkins` and restart Jenkins.

**`Host key verification failed` during Deploy**
Add `StrictHostKeyChecking=no` is already set in the Jenkinsfile. If it still fails, ensure the SSH private key credential (`deploy-server-ssh`) is correct and the matching public key is in `~/.ssh/authorized_keys` on the server.

**`APP_KEY` is missing or invalid**
Generate one with:
```bash
docker run --rm php:8.2-cli php -r "echo 'base64:'.base64_encode(random_bytes(32)).PHP_EOL;"
```
Paste the output into the `laravel-app-key` Jenkins credential.

**React app shows blank page / API calls fail**
The `REACT_APP_API_BASE_URL` is baked in at build time. If the URL changed, update the Jenkins credential and re-run the pipeline to rebuild the image.
