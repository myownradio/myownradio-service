resource "aws_ecr_repository" "frontend" {
  name = "myownradio/frontend"
}

output "frontend_image_url" {
  value = aws_ecr_repository.frontend.repository_url
}

resource "aws_ecr_repository" "frontend_proxy" {
  name = "myownradio/frontend-proxy"
}

output "frontend-proxy_image_url" {
  value = aws_ecr_repository.frontend_proxy.repository_url
}

resource "aws_ecr_repository" "migration" {
  name = "myownradio/migration"
}

output "migration_image_url" {
  value = aws_ecr_repository.migration.repository_url
}

resource "aws_ecr_repository" "auth-server" {
  name = "myownradio/auth-server"
}

output "auth-server_image_url" {
  value = aws_ecr_repository.auth-server.repository_url
}
