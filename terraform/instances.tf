resource "digitalocean_ssh_key" "deployer_key" {
  name       = "mor_deployer_key"
  public_key = tls_private_key.deployer_key.public_key_openssh
}

//resource "digitalocean_droplet" "mor_new" {
//  image  = "ubuntu-18-04-x64"
//  name   = "new.myownradio.biz"
//  size   = "s-1vcpu-2gb"
//  region = local.digitalocean_region
//  ssh_keys = [
//    digitalocean_ssh_key.mor-digitalocean.fingerprint
//  ]
//
//  count = 1
//
//  connection {
//    host        = self.ipv4_address
//    user        = "root"
//    type        = "ssh"
//    private_key = tls_private_key.ssh.private_key_pem
//  }
//
//  provisioner "remote-exec" {
//    inline = [
//      "sudo snap install microk8s --classic",
//      "sudo microk8s.status --wait-ready",
//      "sudo microk8s.enable dns dashboard registry",
//      "sudo useradd -m ubuntu"
//    ]
//  }
//}
//
//output "mor_new_ip_addresses" {
//  value = digitalocean_droplet.mor_new.*.ipv4_address
//}
