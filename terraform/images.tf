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

resource "aws_ecr_repository" "fileserver-local" {
  name = "myownradio/fileserver-local"
}

output "fileserver-local_image_url" {
  value = aws_ecr_repository.fileserver-local.repository_url
}

resource "aws_ecr_repository" "audio-uploader" {
  name = "myownradio/audio-uploader"
}

output "audio-uploader_image_url" {
  value = aws_ecr_repository.audio-uploader.repository_url
}

resource "aws_ecr_repository" "radiomanager-frontend" {
  name = "myownradio/radiomanager-frontend"
}

output "radiomanager-frontend_image_url" {
  value = aws_ecr_repository.radiomanager-frontend.repository_url
}

resource "aws_ecr_repository" "radiomanager-backend" {
  name = "myownradio/radiomanager-backend"
}

output "radiomanager-backend_image_url" {
  value = aws_ecr_repository.radiomanager-backend.repository_url
}
