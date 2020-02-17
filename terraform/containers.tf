provider "aws" {
  region = "eu-central-1"
}

resource "aws_ecr_repository" "frontend" {
  name                 = "myownradio/frontend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

output "frontend_repository_url" {
  value = aws_ecr_repository.frontend.repository_url
}
