provider "digitalocean" {
  token = var.do_token
}

provider "aws" {
  region = "eu-central-1"
}
