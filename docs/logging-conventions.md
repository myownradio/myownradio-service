# logging conventions
1. Every logging entry should be in json format
1. Every error should be logged using levels "error" or "warn" and contain stack
1. Every failed http request should contain: `route`, `method`, `status_code` and error with stack
1. Every non-error logging entry should have level "debug" and should be ignored in production
1. Each logging entry should contain hostname of service instance
