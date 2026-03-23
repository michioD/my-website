terraform {
  required_providers {
    oci = {
      source  = "oracle/oci"
      version = ">= 5.0.0"
    }
  }
}

provider "oci" {
  tenancy_ocid     = var.tenancy_ocid
  user_ocid        = var.user_ocid
  fingerprint      = var.fingerprint
  private_key_path = "~/.oci/oci_api_key.pem"
  region           = "eu-stockholm-1"
}

# Variable definitions (these allow the .tfvars file to work)
variable "tenancy_ocid" {}
variable "user_ocid" {}
variable "fingerprint" {}
variable "instance_ocid" {}
variable "subnet_ocid" {}

