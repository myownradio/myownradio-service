locals {
  digitalocean_region = "fra1"
}

variable "do_token" {}

provider "digitalocean" {
  token = var.do_token
}

resource "digitalocean_floating_ip" "mor_service1" {
  region = local.digitalocean_region
}
