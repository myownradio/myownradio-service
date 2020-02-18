resource "aws_ecr_repository" "frontend" {
  name = "myownradio/frontend"
}

output "frontend_repository_url" {
  value = aws_ecr_repository.frontend.repository_url
}
