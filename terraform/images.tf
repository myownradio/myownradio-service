resource "aws_ecr_repository" "frontend" {
  name = "myownradio/frontend"
}

output "frontend_repository_url" {
  value = aws_ecr_repository.frontend.repository_url
}

resource "aws_ecr_repository" "frontend_proxy" {
  name = "myownradio/frontend-proxy"
}

output "frontend_proxy_repository_url" {
  value = aws_ecr_repository.frontend_proxy.repository_url
}
