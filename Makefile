install:
	yarn install
	docker-compose pull

start:
	yarn start

dev:
	yarn dev

migrate:
	yarn migrate

start-services:
	docker-compose up -d

stop-services:
	docker-compose stop
