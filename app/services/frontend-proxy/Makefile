IMAGE_NAME := myownradio/frontend-proxy
IMAGE_TAG := latest

build:
	docker build -t $(IMAGE_NAME):$(IMAGE_TAG) .

inspect:
	docker run -it --rm $(IMAGE_NAME):$(IMAGE_TAG) bash
