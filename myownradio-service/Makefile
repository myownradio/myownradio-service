IMAGE_VAR = $(shell echo $(SERVICE) | tr a-z\- A-Z\_)_IMAGE
ESCAPE_IMAGE_NAME = $(shell echo $(IMAGE_NAME) | sed 's/\//\\\//g')

update-single-service: check-env
	sed -i "s/^$(IMAGE_VAR)=.*/$(IMAGE_VAR)=$(ESCAPE_IMAGE_NAME):$(IMAGE_TAG)/" ./docker-compose.state.env

check-env:
	@test -n "$(SERVICE)" || (echo SERVICE is undefined && exit 1)
	@test -n "$(IMAGE_NAME)" || (echo IMAGE_NAME is undefined && exit 1)
	@test -n "$(IMAGE_TAG)" || (echo IMAGE_TAG is undefined && exit 1)
