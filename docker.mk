build-service:
	docker build -t $(SERVICE) ./services/$(SERVICE)

build-app:
	docker build -t $(SERVICE) --build-arg SERVICE=$(SERVICE) app/
