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
      "echo aws_access_key_id=${aws_iam_access_key.deployer_ro.id} >> /home/deployer/.aws/credentials",
      "echo aws_secret_access_key=${aws_iam_access_key.deployer_ro.secret} >> /home/deployer/.aws/credentials",
      "chown -R deployer:deployer /home/deployer/.aws"
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
