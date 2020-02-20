resource "digitalocean_ssh_key" "deployer_key" {
  name       = "mor_deployer_key"
  public_key = tls_private_key.deployer_key.public_key_openssh
}

resource "digitalocean_droplet" "mor_master" {
  image  = "ubuntu-18-04-x64"
  name   = "mor-master"
  size   = "s-1vcpu-1gb"
  region = "fra1"
  ssh_keys = [
    digitalocean_ssh_key.deployer_key.fingerprint
  ]

  private_networking = true
  monitoring         = true

  connection {
    host        = self.ipv4_address
    user        = "root"
    type        = "ssh"
    private_key = tls_private_key.deployer_key.private_key_pem
  }

  provisioner "remote-exec" {
    inline = [
      "apt-get update",
      "apt-get install -y apt-transport-https ca-certificates curl software-properties-common",
      "curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -",
      "add-apt-repository \"deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable\"",
      "apt-get install -y docker-ce",
      "docker swarm init --advertise-addr=${self.ipv4_address_private}",
      "mkdir -p /root/swarm",
      "docker swarm join-token manager > /root/swarm/master-token",
      "docker swarm join-token worker > /root/swarm/worker-token",
      "useradd -m -s /bin/bash deployer",
      "usermod -a -G docker deployer",
      "mkdir -p /home/deployer/.ssh && chown -R deployer:deployer /home/deployer",
      "cp /root/.ssh/authorized_keys /home/deployer/.ssh/authorized_keys",
      "chown deployer /home/deployer/.ssh/authorized_keys",
      "chmod 0644 /home/deployer/.ssh/authorized_keys"
    ]
  }
}

resource "digitalocean_floating_ip" "mor_master" {
  region     = "fra1"
  droplet_id = digitalocean_droplet.mor_master.id
}

output "mor_master_ip_address" {
  value = digitalocean_floating_ip.mor_master.ip_address
}
