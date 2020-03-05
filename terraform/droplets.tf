resource "digitalocean_droplet" "new" {
  image  = "ubuntu-19-10-x64"
  name   = "new"
  size   = "s-1vcpu-2gb"
  region = "fra1"

  private_networking = true
  monitoring         = true

  ssh_keys = [
    digitalocean_ssh_key.deployer_key.fingerprint
  ]

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

  provisioner "remote-exec" {
    inline = [
      "fallocate -l 2G /swapfile",
      "chmod 600 /swapfile",
      "mkswap /swapfile",
      "swapon /swapfile",
      "echo \"/swapfile   none    swap    sw    0   0\" >> /etc/fstab"
    ]
  }
}

resource "digitalocean_floating_ip" "new" {
  region     = "fra1"
  droplet_id = digitalocean_droplet.new.id
}
