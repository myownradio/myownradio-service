LOCAL_PREFIX := myownradio/
IMAGE_URL = $(shell cd terraform && terraform output $(SERVICE)_image_url)
GIT_COMMIT = $(shell git log -n 1 --pretty=format:'%H')

APPS := frontend
SERVICES := frontend-proxy

build-service:
	docker build -t $(LOCAL_PREFIX)$(SERVICE) ./services/$(SERVICE)

build-app:
	docker build -t $(LOCAL_PREFIX)$(SERVICE) --file app/packages/$(SERVICE)/Dockerfile app/

build-services:
	@$(foreach SERVICE,$(SERVICES),make SERVICE=$(SERVICE) build-service)

build-apps:
	@$(foreach APP,$(APPS),make SERVICE=$(APP) build-app)

build-all: build-services build-apps

push:
	docker tag $(LOCAL_PREFIX)$(SERVICE) $(IMAGE_URL):$(GIT_COMMIT)
	docker tag $(LOCAL_PREFIX)$(SERVICE) $(IMAGE_URL):latest
	docker push $(IMAGE_URL):$(GIT_COMMIT)
	docker push $(IMAGE_URL):latest

push-all:
	@$(foreach SERVICE,$(SERVICES),make SERVICE=$(SERVICE) push)
	@$(foreach APP,$(APPS),make SERVICE=$(APP) push)

build-and-push-all: build-all push-all
