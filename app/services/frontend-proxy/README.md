# frontend-proxy

This service is used to route incoming traffic into application services.


### Routing Table

| Route Prefix | Application Service | Port |
|--------------|---------------------|------|  
| /api/auth    | auth-server         | 8080 |
| /            | frontend            | 3000 |
