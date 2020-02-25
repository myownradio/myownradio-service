provider "digitalocean" {
  token = var.do_token
}

provider "aws" {
  region = "eu-central-1"
}

provider "cloudflare" {
  api_token = var.cloudflare_token
}
