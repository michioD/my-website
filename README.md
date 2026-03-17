<div align="center">
<img width="600" height="600" alt="GHBanner" src="https://i.pinimg.com/736x/59/4d/fe/594dfefaa9626bfd397d789c512f5927.jpg" />
</div>

# Welcome to my e2e web platform!
This project serves as a secure, high-performance personal portfolio and blog, featuring custom Go-based 
API proxies and an automated deployment pipeline.  

# The infrastructure layer

Cloud Provisioning & Hardening: Manually provisioned an OCI Compute Instance (Ubuntu 22.04 LTS) with custom Virtual Cloud Network (VCN) settings. Security is enforced through strictly defined OCI Security Lists (limiting ingress to ports 80/443/22) and host-level IP Tables configuration.

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Build:
   `npm run build`
3. Run the app:
   `npm run dev`
