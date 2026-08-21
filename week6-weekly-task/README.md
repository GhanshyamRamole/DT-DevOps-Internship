# DevOps Week 6 — Weekly Task: Terraform + Ansible

Provisions a Docker container (acting as an "application server") with
Terraform, then configures it with Ansible — installing packages, creating a
user, and starting nginx.

Uses Docker instead of a cloud provider so this can be run entirely for free,
with no AWS/Azure/GCP account required — building on the Docker setup from
Week 4.

## Project Structure

```
.
├── main.tf              # Docker provider + resources
├── variables.tf          # container_name, ssh_port, http_port
├── outputs.tf             # connection details for Ansible
├── ansible.cfg
├── docker/
│   └── Dockerfile          # Ubuntu + SSH server (the "VM" Terraform provisions)
└── ansible/
    ├── inventory.ini        # points at the provisioned container
    └── playbook.yml          # installs packages, creates user, starts nginx
```

## Prerequisites

- Docker Desktop (or Docker Engine) installed and running
- Terraform installed — download from https://developer.hashicorp.com/terraform/install
- Ansible installed:
  ```bash
  # Ubuntu/Debian
  sudo apt install ansible
  # macOS
  brew install ansible
  ```

## Step 1: Provision the Infrastructure with Terraform

```bash
terraform init      # downloads the Docker provider
terraform plan       # review what will be created - ALWAYS do this before apply
terraform apply       # actually creates the container
```

`terraform apply` will build the custom image and start a container reachable
at `127.0.0.1:2222` over SSH (root / devops123 — demo credentials only, see
security note below).

Screenshot `terraform plan` and `terraform apply` output — these satisfy the
"Screenshots of Terraform Execution" requirement.

## Step 2: Configure the Server with Ansible

```bash
cd ansible
ansible-playbook playbook.yml
```

This connects over SSH to the container Terraform just created and:
1. Installs nginx, curl, and git
2. Creates an `appuser` account
3. Starts and enables the nginx service
4. Verifies nginx responds with HTTP 200

Screenshot this run — satisfies "Screenshot of Ansible Playbook Execution".

## Step 3: Verify

```bash
curl http://127.0.0.1:8080
# or open http://127.0.0.1:8080 in a browser
```

## Step 4: Tear Down

```bash
terraform destroy
```

This removes the container entirely — infrastructure that's fully disposable
and recreatable from code.

## Terraform vs Ansible, in Practice

- **Terraform** answered: "does the server exist?" — it built and started the
  container.
- **Ansible** answered: "is the server configured correctly?" — it installed
  software and set things up once the server already existed.

Terraform doesn't know or care what's installed inside the container; Ansible
doesn't know or care how the container was created. Each tool does one job
well, and Terraform's outputs feed directly into Ansible's inventory to
connect the two.

## Security Note

The SSH root password (`devops123`) is hardcoded in the Dockerfile for local
learning purposes only. Never do this for a real server — use SSH key-based
authentication and a non-root user instead.
