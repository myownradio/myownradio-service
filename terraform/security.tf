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

resource "tls_private_key" "deployer_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "digitalocean_ssh_key" "deployer_key" {
  name       = "mor_deployer_key"
  public_key = tls_private_key.deployer_key.public_key_openssh
}
