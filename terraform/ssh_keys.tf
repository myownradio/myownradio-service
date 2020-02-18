resource "digitalocean_ssh_key" "roman-wsl-key" {
  name       = "roman-wsl-key"
  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDaR2Aradibbu0dxBv5bAD8bJOhLDX6mHx3ZnPUt5q+0HByztdEkBl+PO4RgpLJf0Y9NdKNCPCWs9vRdj50WFhkcze1kD6vBOEoIJN/eT2zu2jWmPWJpbG5twbKbD5a4EzJfny80SRGMtu27YPZJW+qamEv8UR3IL/w8Lpmhe7YvMcBk2BCGqY8IU4BmYcA8BVFAzgJGYJdqfgU3odm2a64u8YuHF2HVsrZ0BWJVds0si4n/8i31G7yGGF/h/EEPRUmKqCZBtNvjp66yaWBlfj7cvyaVhkxBa2m4FT2cH84yBOG50+rDjtaFcoBhQXUX8PSeCrzgytxR8nLtvSEetD1 roman@DESKTOP-G3501L6"
}

locals {
  public_ssh_keys = [
    digitalocean_ssh_key.roman-wsl-key
  ]
}

output "ssh_keys" {
  value = local.public_ssh_keys
}
