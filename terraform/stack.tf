locals {
  digitalocean_region = "fra1"
  install_microk8s_inline = [
    "sudo snap install microk8s --classic",
    "sudo microk8s.status --wait-ready",
    "sudo microk8s.enable dns dashboard registry"
  ]
}

variable "do_token" {}

provider "digitalocean" {
  token = var.do_token
}

resource "tls_private_key" "ssh" {
  algorithm = "RSA"
  rsa_bits = 4096
}

output "ssh_private" {
  value = tls_private_key.ssh.private_key_pem
  sensitive = true
}

resource "digitalocean_ssh_key" "mor-digitalocean" {
  name = "mor-digitalocean"
  public_key = tls_private_key.ssh.public_key_openssh
}

//resource "digitalocean_floating_ip" "mor_new_fip" {
//  region = local.digitalocean_region
//  droplet_id = digitalocean_droplet.mor_new.id
//}

resource "digitalocean_droplet" "mor_new" {
  image = "ubuntu-18-04-x64"
  name = "new.myownradio.biz"
  region = local.digitalocean_region
  size = "s-1vcpu-2gb"
  ssh_keys = [
    digitalocean_ssh_key.mor-digitalocean.fingerprint
  ]

  connection {
    host = digitalocean_droplet.mor_new.ipv4_address
    user = "root"
    type = "ssh"
    private_key = tls_private_key.ssh.private_key_pem
  }

  provisioner "remote-exec" {
    inline = local.install_microk8s_inline
  }
}

output "mor_new_ip_address" {
  value = digitalocean_droplet.mor_new.ipv4_address
}
