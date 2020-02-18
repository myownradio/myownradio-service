
//
//output "mor_new_ip_address" {
//  value = digitalocean_droplet.mor_new.ipv4_address
//}
//
//resource "null_resource" "test" {
//  triggers = {
//    ssh_keys = join(",", local.ssh_keys.*.id)
//  }
//
//  connection {
//    host = digitalocean_droplet.mor_new.ipv4_address
//    user = "root"
//    type = "ssh"
//    private_key = tls_private_key.ssh.private_key_pem
//  }
//
//  provisioner "file" {
//    content = join("\n", local.ssh_keys.*.public_key)
//    destination = "/root/.ssh/authorized_keys"
//  }
//}
//

