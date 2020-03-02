LOCAL_PREFIX := myownradio/
IMAGE_URL = $(shell cd terraform && terraform output $(SERVICE)_image_url)
GIT_COMMIT = $(shell git log -n 1 --pretty=format:'%H')
PULL_LATEST = no

APPS := frontend migration
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
	docker build -t $(LOCAL_PREFIX)$(SERVICE) ./services/$(SERVICE)

build-app:
	docker build -t $(LOCAL_PREFIX)$(SERVICE) --file app/packages/$(SERVICE)/Dockerfile app/

build-all-services:
	@$(foreach SERVICE,$(SERVICES),make SERVICE=$(SERVICE) build-service)

build-all-apps:
	@$(foreach APP,$(APPS),make SERVICE=$(APP) build-app)

build-all: build-all-services build-all-apps

push:
ifneq ($(filter $(SERVICE),$(LATEST_TAG_ONLY)),)
	docker tag $(LOCAL_PREFIX)$(SERVICE) $(IMAGE_URL):$(GIT_COMMIT)
	docker push $(IMAGE_URL):$(GIT_COMMIT)
else
    $(info $(ENV_PARAM) does not exist in $(PARAMS))
endif

push-all:
	@$(foreach SERVICE,$(SERVICES),make SERVICE=$(SERVICE) push)
	@$(foreach APP,$(APPS),make SERVICE=$(APP) push)
