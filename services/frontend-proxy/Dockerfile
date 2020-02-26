FROM ubuntu:19.04

MAINTAINER Roman Lakhtadyr <roman.lakhtadyr@gmail.com>

ENV DEBIAN_FRONTEND         noninteractive
ENV MAX_UPLOAD_FILESIZE     256

# Install container dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends --no-install-suggests nginx && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# nginx
RUN echo '\
upstream frontend {\n\
    server frontend:3000;\n\
}\n\
server {\n\
    listen       8080;\n\
    server_name  localhost default;\n\
    root         /usr/app/public;\n\
    access_log   /dev/stderr combined;\n\
    client_max_body_size '${MAX_UPLOAD_FILESIZE}'M;\n\
    location / {\n\
        proxy_pass         http://frontend;\n\
        proxy_redirect     off;\n\
        proxy_set_header   Host $host;\n\
        proxy_set_header   X-Real-IP $remote_addr;\n\
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;\n\
        proxy_set_header   X-Forwarded-Host $server_name;\n\
    }\n\
}\n\
' > /etc/nginx/sites-available/default

CMD ["nginx", "-g", "daemon off; error_log /dev/stderr;"]

EXPOSE 8080

HEALTHCHECK --interval=5s --timeout=3s \
  CMD curl -f http://localhost:8080/ || exit 1
