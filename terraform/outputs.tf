output "deployer_private_key" {
  value     = tls_private_key.deployer_key.private_key_pem
  sensitive = true
}

output "deployer_public_key" {
  value     = tls_private_key.deployer_key.public_key_openssh
  sensitive = true
}

output "mor_master_ip_address" {
  value = digitalocean_floating_ip.new.ip_address
}

output "url" {
  value = "https://${cloudflare_record.a_record.name}.${cloudflare_zone.myownradio_biz.zone}"
}
