IMAGE_NAME := myownradio/fileserver-local
IMAGE_TAG := latest
SERVICE_NAME := fileserver-local

build:
	docker build --build-arg SERVICE_NAME=$(SERVICE_NAME) -t $(IMAGE_NAME):$(IMAGE_TAG) ../..

push:
	docker push $(IMAGE_NAME):$(IMAGE_TAG)

start:
	docker run -it --rm -p 8080:8080 $(IMAGE_NAME):$(IMAGE_TAG)
