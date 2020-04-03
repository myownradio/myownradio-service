resource "cloudflare_zone" "myownradio_biz" {
  zone = "myownradio.biz"

  lifecycle {
    prevent_destroy = true
  }
}

resource "cloudflare_record" "a_record" {
  name    = "new"
  type    = "A"
  zone_id = cloudflare_zone.myownradio_biz.id
  value   = var.deploy_ip_address
}
