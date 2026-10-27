
terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.27"
    }
  }

  required_version = ">= 1.5.0"
}

provider "cloudflare" {}
