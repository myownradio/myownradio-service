LOCAL_PREFIX := myownradio/
IMAGE_URL = $(shell cd terraform && terraform output $(SERVICE)_image_url)
GIT_COMMIT = $(shell git log -n 1 --pretty=format:'%H')
PULL_LATEST = no

APPS := radiomanager-frontend migration auth-server fileserver-local audio-uploader
SERVICES := frontend-proxy
LATEST_TAG_ONLY := migration

setup: setup-terraform setup-services

setup-terraform:
	(cd terraform && terraform init)

setup-services:
	(cd app && yarn install)


# Application Section
run-tests:
	(cd app && yarn test)

run-linter:
	(cd app && yarn lint)
	(cd terraform && terraform fmt -check)

# Terraform Section
terraform-apply:
	(cd terraform && terraform apply)

terraform-plan:
	(cd terraform && terraform plan)


# Docker Section
build-service:
	@echo "Building image for service: $(SERVICE)..."
	docker build -t $(LOCAL_PREFIX)$(SERVICE) ./services/$(SERVICE)

build-app:
	@echo "Building image for application service: $(SERVICE)..."
	docker build -t $(LOCAL_PREFIX)$(SERVICE) --file app/services/$(SERVICE)/Dockerfile app/

build-all-services:
	$(foreach SERVICE,$(SERVICES),$(MAKE) SERVICE=$(SERVICE) build-service && ) true

build-all-apps:
	$(foreach APP,$(APPS),$(MAKE) SERVICE=$(APP) build-app && ) true

build-all: build-all-services build-all-apps

push:
ifeq ($(filter $(SERVICE),$(LATEST_TAG_ONLY)),)
	docker tag $(LOCAL_PREFIX)$(SERVICE) $(IMAGE_URL):$(GIT_COMMIT)
	docker push $(IMAGE_URL):$(GIT_COMMIT)
endif
	docker tag $(LOCAL_PREFIX)$(SERVICE) $(IMAGE_URL):latest
	docker push $(IMAGE_URL):latest

push-all:
	$(foreach SERVICE,$(SERVICES),$(MAKE) SERVICE=$(SERVICE) push && ) true
	$(foreach APP,$(APPS),$(MAKE) SERVICE=$(APP) push && ) true
