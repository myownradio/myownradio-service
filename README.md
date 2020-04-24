# myownradio-service

### Development environment
#### Requirements:
* NodeJS 13+
* Docker 19.03+
* Docker Compose
* Terraform

To start project in development environment first of all you need to install development environment:
```bash
make install
```

Not we need to start backing services needed in development:
```bash
make start-services
```
this will start backing services in background.

Now apply latest database migrations:
```bash
make run-migrations
```

Finally, start application services in development mode:
```bash
make start-development
```

To stop background services run:
```bash
make stop-services
```
