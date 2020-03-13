FROM ubuntu:19.04

MAINTAINER Roman Lakhtadyr <roman.lakhtadyr@gmail.com>

ARG MAX_UPLOAD_FILESIZE=256

ENV DEBIAN_FRONTEND         noninteractive

# Install container dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends --no-install-suggests \
        nginx \
        ca-certificates \
        curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# nginx
RUN echo '\
resolver 127.0.0.11 valid=1s;\n\
resolver_timeout 5s;\n\
server {\n\
    listen                  80;\n\
    listen                  443 ssl;\n\
    ssl_certificate         /etc/ssl/myownradio.biz.crt;\n\
    ssl_certificate_key     /etc/ssl/myownradio.biz.key;\n\
    server_name             localhost default;\n\
    access_log              /dev/stderr combined;\n\
    client_max_body_size    '${MAX_UPLOAD_FILESIZE}'M;\n\
    location / {\n\
        proxy_pass         http://radiomanager-frontend:80;\n\
        proxy_redirect     off;\n\
        proxy_set_header   Host $host;\n\
        proxy_set_header   X-Real-IP $remote_addr;\n\
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;\n\
        proxy_set_header   X-Forwarded-Host $server_name;\n\
    }\n\
    location /api/auth {\n\
        rewrite            ^/api/auth/(.*) /$1 break;\n\
        proxy_pass         http://auth-server:8080;\n\
        proxy_redirect     off;\n\
        proxy_set_header   Host $host;\n\
        proxy_set_header   X-Real-IP $remote_addr;\n\
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;\n\
        proxy_set_header   X-Forwarded-Host $server_name;\n\
    }\n\
    location = /healthcheck {\n\
        add_header Content-Type text/plain;\n\
        allow 127.0.0.1;\n\
        deny all;\n\
        access_log off;\n\
        return 200 "healthy";\n\
    }\n\
}\n\
' > /etc/nginx/sites-available/default

COPY certs/* /etc/ssl/

CMD ["nginx", "-g", "daemon off; error_log /dev/stderr;"]

EXPOSE 80
EXPOSE 443

HEALTHCHECK --interval=5s --timeout=30s \
    CMD curl -skS https://127.0.0.1/healthcheck || exit 1

HEALTHCHECK --interval=5s --timeout=30s \
    CMD curl -sS http://127.0.0.1/healthcheck || exit 1
