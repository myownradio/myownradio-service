provider "digitalocean" {
  token = var.do_token
}

provider "github" {
  token      = var.github_token
  individual = true
}
