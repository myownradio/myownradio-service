IMAGE_NAME := myownradio/frontend-proxy
IMAGE_TAG := latest

DOCKER_HOST = $(shell docker context inspect --format {{.Endpoints.docker.Host}})

test:
	DOCKER_HOST=$(DOCKER_HOST) \
	docker-compose --file tests/docker-compose.test.yml up --abort-on-container-exit --build --exit-code-from sut
