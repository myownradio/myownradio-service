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

resource "digitalocean_ssh_key" "roman-wsl-key" {
  name = "roman-wsl-key"
  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDaR2Aradibbu0dxBv5bAD8bJOhLDX6mHx3ZnPUt5q+0HByztdEkBl+PO4RgpLJf0Y9NdKNCPCWs9vRdj50WFhkcze1kD6vBOEoIJN/eT2zu2jWmPWJpbG5twbKbD5a4EzJfny80SRGMtu27YPZJW+qamEv8UR3IL/w8Lpmhe7YvMcBk2BCGqY8IU4BmYcA8BVFAzgJGYJdqfgU3odm2a64u8YuHF2HVsrZ0BWJVds0si4n/8i31G7yGGF/h/EEPRUmKqCZBtNvjp66yaWBlfj7cvyaVhkxBa2m4FT2cH84yBOG50+rDjtaFcoBhQXUX8PSeCrzgytxR8nLtvSEetD1 roman@DESKTOP-G3501L6"
}

locals {
  ssh_keys = [
    digitalocean_ssh_key.mor-digitalocean,
    digitalocean_ssh_key.roman-wsl-key
  ]
}

resource "digitalocean_droplet" "mor_new" {
  image = "ubuntu-18-04-x64"
  name = "new.myownradio.biz"
  region = local.digitalocean_region
  size = "s-1vcpu-2gb"
  ssh_keys = [
    digitalocean_ssh_key.mor-digitalocean.fingerprint,
    digitalocean_ssh_key.roman-wsl-key.fingerprint
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

resource "null_resource" "test" {
  triggers = {
    ssh_keys = join(",", local.ssh_keys.*.id)
  }

  connection {
    host = digitalocean_droplet.mor_new.ipv4_address
    user = "root"
    type = "ssh"
    private_key = tls_private_key.ssh.private_key_pem
  }

  provisioner "file" {
    content = join("\n", local.ssh_keys.*.public_key)
    destination = "/root/.ssh/authorized_keys"
  }
}

