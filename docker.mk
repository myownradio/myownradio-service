SERVICE := CHANGE_ME
IMAGE_NAME := myownradio/$(SERVICE)
IMAGE_TAG := latest
IMAGE_REPOSITORY = $(shell cd terraform && terraform output $(SERVICE)_repository_url)

docker-aws-login:
	$(aws ecr get-login --no-include-email --region eu-central-1)

docker-build:
	docker build -t $(IMAGE_NAME):$(IMAGE_TAG) -f packages/$(SERVICE)/Dockerfile .

docker-push:
	docker tag myownradio/$(SERVICE):$(IMAGE_TAG) $(IMAGE_REPOSITORY):$(IMAGE_TAG)
	docker push $(IMAGE_REPOSITORY):$(IMAGE_TAG)
