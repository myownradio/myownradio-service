LOCAL_PREFIX := myownradio/
IMAGE_URL := registry.homefs.biz/$(SERVICE)
GIT_COMMIT = $(shell git log -n 1 --pretty=format:'%H')

APPS := radiomanager-frontend migration auth-server audio-uploader radiomanager-backend scheduler stream-composer audio-player
SERVICES := frontend-proxy
LATEST_TAG_ONLY := migration

cleanup:
	git clean -dfX

install:
	(cd app && yarn install)
	(cd app && docker-compose pull)

start-services:
	(cd app && docker-compose up -d)

stop-services:
	(cd app && docker-compose stop)

start-development:
	(cd app && yarn dev)

run-migrations:
	(cd app && yarn migrate)

run-tests:
	(cd app && yarn test)

run-linter:
	(cd app && yarn lint)

# Build Section
build-app-service:
	@echo "Building image for application service: $(SERVICE)..."
	docker build -t $(LOCAL_PREFIX)$(SERVICE) --file app/services/$(SERVICE)/Dockerfile app/

build-all-app-services:
	for service in $(shell ls app/services); do \
		$(MAKE) SERVICE=$${service} build-app || exit 1; \
	done

build-all: build-all-app-services

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
