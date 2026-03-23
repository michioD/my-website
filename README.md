<div align="center">
<img width="600" height="600" alt="GHBanner" src="https://i.pinimg.com/736x/59/4d/fe/594dfefaa9626bfd397d789c512f5927.jpg" />
</div>

# Welcome to my e2e web platform!
This project serves as a secure, high-performance personal portfolio and blog, featuring custom Go-based API proxies and an automated deployment pipeline.  

You can access the website here: [michiod.site](https://michiod.site/)

<!-- # Backend -->

<!-- # Frontend -->
# The infrastructure layer

Cloud Provisioning & Hardening: Manually provisioned an OCI Compute Instance (Ubuntu 22.04 LTS) with custom Virtual Cloud Network (VCN) settings. Security is enforced through strictly defined OCI Security Lists (limiting ingress to ports 80/443/22) and host-level IP Tables configuration.

## 🔐 Security & Secret Management

This repository adheres to strict GitOps security principles. No sensitive credentials, private keys, or cloud identifiers are hardcoded into the codebase. 

Secret management is handled via a two-tier approach to ensure secure local development and automated CI/CD pipelines:

* **Local Development (Terraform):** Local infrastructure changes require a git-ignored `terraform.tfvars` file containing OCI tenant IDs, and a locally stored RSA private key (`.pem`). This ensures developers only use keys explicitly provisioned to their local machines.
* **CI/CD Pipeline (GitHub Actions):** The automated deployment pipeline authenticates with Oracle Cloud using **GitHub Secrets** (for the encrypted `.pem` private key) and **GitHub Variables** (for OCIDs and environment IDs). The workflow uses short-lived, isolated Ubuntu runners that inject these secrets at runtime and scrub them from all build logs.

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Build:
   `npm run build`
3. Run the app:
   `npm run dev`

