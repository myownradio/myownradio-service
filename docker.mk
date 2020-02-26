FRONTEND_PROXY_REPO_URL = $(shell cd terraform && terraform output frontend_proxy_repository_url)
FRONTEND_REPO_URL = $(shell cd terraform && terraform output frontend_repository_url)

build-frontend-proxy:
	docker build -t $(FRONTEND_PROXY_REPO_URL) ./services/frontend-proxy


build-frontend:
	docker build -t $(FRONTEND_REPO_URL) ./services/app/packages/frontend
