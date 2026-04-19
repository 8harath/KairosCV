# KairosCV Makefile — convenience wrappers around docker compose commands.
# Run `make help` to see all available targets.

.PHONY: help build up down dev logs shell clean prune typecheck lint test

# ── Variables ─────────────────────────────────────────────────────────────
COMPOSE      := docker compose
COMPOSE_PROD := $(COMPOSE) -f docker-compose.yml -f docker-compose.prod.yml
COMPOSE_DEV  := $(COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml
APP          := app

# Default target
help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
	  awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'

# ── Docker targets ────────────────────────────────────────────────────────
build: ## Build the production Docker image
	$(COMPOSE) build

up: ## Start the production stack (detached)
	$(COMPOSE) up -d

down: ## Stop and remove containers (keep volumes)
	$(COMPOSE) down

prod: ## Start the production-hardened stack (resource limits, read-only FS)
	$(COMPOSE_PROD) up -d

dev: ## Start the hot-reload dev stack
	$(COMPOSE_DEV) up --build

logs: ## Tail app container logs
	$(COMPOSE) logs -f $(APP)

shell: ## Open a shell in the running app container
	$(COMPOSE) exec $(APP) sh

clean: ## Stop containers and remove volumes
	$(COMPOSE) down -v

prune: ## Remove all unused Docker objects (images, containers, volumes, networks)
	docker system prune -f
	docker volume prune -f

# ── Code quality ─────────────────────────────────────────────────────────
typecheck: ## Run TypeScript type-check
	pnpm exec tsc --noEmit

lint: ## Run ESLint
	pnpm lint

test: ## Run unit tests
	pnpm test:run
