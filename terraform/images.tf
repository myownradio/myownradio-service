resource "aws_iam_user" "deployer_ro" {
  name = "deployer-ro"
}

resource "aws_iam_access_key" "deployer_ro" {
  user = aws_iam_user.deployer_ro.name
}

resource "aws_iam_user_policy_attachment" "deployer_ro" {
  user       = aws_iam_user.deployer_ro.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

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
