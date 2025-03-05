
# Set default values
ENV ?= dev
COMPOSE_FILE := docker-compose.$(ENV).yml

.PHONY: help
help: ## Display available commands
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: up
up: ## Start the services defined in the docker-compose file
	docker-compose -f $(COMPOSE_FILE) up -d

.PHONY: down
down: ## Stop and remove containers, networks, volumes, and images created by 'up' command
	docker-compose -f $(COMPOSE_FILE) down

.PHONY: logs
logs: ## View output from services
	docker-compose -f $(COMPOSE_FILE) logs -f

.PHONY: ps
ps: ## List containers
	docker-compose -f $(COMPOSE_FILE) ps
