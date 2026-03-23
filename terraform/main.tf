# __generated__ by Terraform
# Please review these resources and move them into your main configuration files.

# __generated__ by Terraform from "ocid1.instance.oc1.eu-stockholm-1.anqxeljr66a7nkacdm6yny5v72mt5fp4irv62kbeco4afphys26ohj5pq2eq"
resource "oci_core_instance" "my_existing_server" {
  async                      = null
  availability_domain        = "fhdW:EU-STOCKHOLM-1-AD-1"
  capacity_reservation_id    = null
  cluster_placement_group_id = null
  compartment_id             = "ocid1.tenancy.oc1..aaaaaaaa6r7nlbi3wnvyfck247oag4wbsiygnhcqs57cr5ccjesykma7ubhq"
  compute_cluster_id         = null
  dedicated_vm_host_id       = null
  defined_tags = {
    "Oracle-Tags.CreatedBy" = "default/l.m.frykman@gmail.com"
    "Oracle-Tags.CreatedOn" = "2026-03-07T16:27:55.528Z"
  }
  display_name                        = "instance-20260307-1721"
  extended_metadata                   = {}
  fault_domain                        = "FAULT-DOMAIN-3"
  freeform_tags                       = {}
  instance_configuration_id           = null
  ipxe_script                         = null
  is_ai_enterprise_enabled            = null
  is_pv_encryption_in_transit_enabled = null
  metadata = {
    ssh_authorized_keys = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCeDOWt6fPd6L9R00d3lOpQOPeznlh9L4G+TT/MUJSGsTkS2Zv9VUS/wMpSzBdsip/a8wNCcahw2gTGBC5VL7cIZpqAD/WO8Tb2W/e38hiB4mgezqM1JRZJbee1GkTewoggShKfLgGnIfqkLxFKpWdcTiOf4mnP/6v8Wh1MGSVCZQc1jc+nRF4j+ghX7IzuXeG+bnXPzUhA75jZBfbHDS8sWMYJOLydfqFQdteVr5vtcIVeUC9OsDHDzthQuc8xnil2sdfNdPB2gQHRA9LboQXFR3m48dGxXOzxffqMwN8OPJD5cM4AaTwjZMkUaa+VPJOYXXIhcGhuG9qjrMQ+C5gh ssh-key-2026-03-07"
  }
  preserve_boot_volume                    = null
  preserve_data_volumes_created_at_launch = null
  security_attributes                     = {}
  shape                                   = "VM.Standard.E2.1.Micro"
  state                                   = "RUNNING"
  update_operation_constraint             = null
  agent_config {
    are_all_plugins_disabled = false
    is_management_disabled   = false
    is_monitoring_disabled   = false
    plugins_config {
      desired_state = "DISABLED"
      name          = "Vulnerability Scanning"
    }
    plugins_config {
      desired_state = "DISABLED"
      name          = "Management Agent"
    }
    plugins_config {
      desired_state = "ENABLED"
      name          = "Custom Logs Monitoring"
    }
    plugins_config {
      desired_state = "DISABLED"
      name          = "Compute RDMA GPU Monitoring"
    }
    plugins_config {
      desired_state = "ENABLED"
      name          = "Compute Instance Monitoring"
    }
    plugins_config {
      desired_state = "DISABLED"
      name          = "Compute HPC RDMA Auto-Configuration"
    }
    plugins_config {
      desired_state = "DISABLED"
      name          = "Compute HPC RDMA Authentication"
    }
    plugins_config {
      desired_state = "ENABLED"
      name          = "Cloud Guard Workload Protection"
    }
    plugins_config {
      desired_state = "DISABLED"
      name          = "Block Volume Management"
    }
    plugins_config {
      desired_state = "ENABLED"
      name          = "Bastion"
    }
  }
  availability_config {
    is_live_migration_preferred = false
    recovery_action             = "RESTORE_INSTANCE"
  }
  create_vnic_details {
    assign_ipv6ip             = false
    assign_private_dns_record = false
    assign_public_ip          = "true"
    defined_tags = {
      "Oracle-Tags.CreatedBy" = "default/l.m.frykman@gmail.com"
      "Oracle-Tags.CreatedOn" = "2026-03-07T16:27:55.634Z"
    }
    display_name           = "bloop"
    freeform_tags          = {}
    hostname_label         = "bloop"
    nsg_ids                = ["ocid1.networksecuritygroup.oc1.eu-stockholm-1.aaaaaaaauxml2ijnb7tezwirmn64k4qas6aiagswllqoazpk4bj756vtw44q"]
    private_ip             = "10.0.1.248"
    private_ip_id          = null
    security_attributes    = {}
    skip_source_dest_check = false
    subnet_cidr            = null
    subnet_id              = var.subnet_ocid
    vlan_id                = null
  }
  instance_options {
    are_legacy_imds_endpoints_disabled = false
  }
  launch_options {
    boot_volume_type                    = "PARAVIRTUALIZED"
    firmware                            = "UEFI_64"
    is_consistent_volume_naming_enabled = true
    is_pv_encryption_in_transit_enabled = true
    network_type                        = "PARAVIRTUALIZED"
    remote_data_volume_type             = "PARAVIRTUALIZED"
  }
  shape_config {
    baseline_ocpu_utilization = null
    memory_in_gbs             = 1
    nvmes                     = 0
    ocpus                     = 1
    resource_management       = null
    vcpus                     = 2
  }
  source_details {
    boot_volume_size_in_gbs         = "47"
    boot_volume_vpus_per_gb         = "10"
    is_preserve_boot_volume_enabled = false
    kms_key_id                      = null
    source_id                       = "ocid1.image.oc1.eu-stockholm-1.aaaaaaaadbkaho6wjm7ea5ex7ss73wjkyb33lpeer3xm4rcmjkszhmuoifqa"
    source_type                     = "image"
  }
}

# Variable definitions (these allow the .tfvars file to work)
# variable "tenancy_ocid" {}
# variable "user_ocid" {}
# variable "fingerprint" {}
# variable "instance_ocid" {}
# variable "subnet_ocid" {}
