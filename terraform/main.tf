resource "tls_private_key" "deployer_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

output "deployer_private_key" {
  value     = tls_private_key.deployer_key.private_key_pem
  sensitive = true
}

output "deployer_public_key" {
  value     = tls_private_key.deployer_key.public_key_openssh
  sensitive = true
}

resource "digitalocean_ssh_key" "deployer_key" {
  name       = "mor_deployer_key"
  public_key = tls_private_key.deployer_key.public_key_openssh
}

resource "cloudflare_zone" "myownradio_biz" {
  zone = "myownradio.biz"
}

module "swarm_cluster_master_node" {
  source = "./swarm/master_node"

  node_name = "mor-master"

  dns_a_record_name = "new"
  dns_zone_id       = cloudflare_zone.myownradio_biz.id

  ssh_key_fingerprint   = digitalocean_ssh_key.deployer_key.fingerprint
  ssh_private_key       = tls_private_key.deployer_key.private_key_pem
  aws_access_key_id     = aws_iam_access_key.deployer_ro.id
  aws_secret_access_key = aws_iam_access_key.deployer_ro.secret

}

output "mor_master_ip_address" {
  value = module.swarm_cluster_master_node.ip_address
}
