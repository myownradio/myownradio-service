resource "digitalocean_droplet" "master" {
  image  = "ubuntu-18-04-x64"
  name   = var.node_name
  size   = "s-1vcpu-1gb"
  region = "fra1"

  private_networking = true
  monitoring         = true

  ssh_keys = [
    var.ssh_key_fingerprint
  ]

  connection {
    host        = self.ipv4_address
    user        = "root"
    type        = "ssh"
    private_key = var.ssh_private_key
  }

  provisioner "remote-exec" {
    inline = [
      // Initialize and install dependencies
      "apt-get update",
      "apt-get install -y apt-transport-https ca-certificates curl software-properties-common awscli",

      // Install docker-ce
      "curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -",
      "add-apt-repository \"deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable\"",
      "apt-get install -y docker-ce",

      // Initialize docker swarm cluster
      "docker swarm init --advertise-addr=${self.ipv4_address_private}",

      // Create deployer user
      "useradd -m -s /bin/bash deployer && usermod -a -G docker deployer",

      // Copy keys from root to deployer
      "mkdir -p /home/deployer/.ssh",
      "cp /root/.ssh/authorized_keys /home/deployer/.ssh/authorized_keys",
      "chown -R deployer:deployer /home/deployer/.ssh",
      "chmod 0644 /home/deployer/.ssh/authorized_keys",
    ]
  }

  provisioner "remote-exec" {
    inline = [
      // Configure ECR credentials
      "mkdir /home/deployer/.aws",
      "echo [default] > /home/deployer/.aws/credentials",
      "echo aws_access_key_id=${var.aws_access_key_id} >> /home/deployer/.aws/credentials",
      "echo aws_secret_access_key=${var.aws_secret_access_key} >> /home/deployer/.aws/credentials",
      "chown -R deployer:deployer /home/deployer/.aws"
    ]
  }
}


resource "digitalocean_floating_ip" "master" {
  region     = "fra1"
  droplet_id = digitalocean_droplet.master.id
}


resource "cloudflare_record" "a_record" {
  name = var.dns_a_record_name
  zone_id = var.dns_zone_id
  type = "A"
  value = digitalocean_floating_ip.master.ip_address
}
