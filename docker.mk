FRONTEND_PROXY_REPO_URL = $(shell cd terraform && terraform output frontend_proxy_repository_url)
FRONTEND_REPO_URL = $(shell cd terraform && terraform output frontend_repository_url)

build-frontend-proxy:
	docker build -t $(FRONTEND_PROXY_REPO_URL) ./services/frontend-proxy

build-frontend:
	docker build -t $(FRONTEND_REPO_URL) ./services/app/packages/frontend

build-service:
	docker build -t $(SERVICE) ./services/$(SERVICE)

build-app:
	docker build -t $(SERVICE) --build-arg SERVICE=$(SERVICE) services/app/
