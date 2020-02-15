terraform {
  backend "s3" {
    bucket = "myownradio-tfstate"
    key    = "terraform.tfstate"
    region = "eu-central-1"
  }
}
