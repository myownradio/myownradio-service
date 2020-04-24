# myownradio-service

### Development environment
#### Requirements:
* NodeJS 13+
* Docker 19.03+
* Docker Compose
* Terraform

To start project in development environment first of all you need to install all required dependencies and initialize project:
```bash
make install
```

Now we need to start background backing services reqired for development:
```bash
make start-services
```

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

About details and other available rules see `Makefile`.
