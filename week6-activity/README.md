# DevOps Week 6 — Hands-on Activity: Full Terraform + Ansible Workflow

Reuses the infrastructure from the Weekly Task and extends the Ansible
playbook to deploy actual web content, configure a custom nginx site, verify
the result, then demonstrates changing that configuration purely through
Ansible — no manual server access required.

## Project Structure

```
.
├── main.tf / variables.tf / outputs.tf   # same as Weekly Task
├── docker/Dockerfile
├── ansible.cfg
└── ansible/
    ├── inventory.ini
    ├── playbook.yml                # full config + verification
    └── templates/
        ├── index.html.j2            # deployed web page (uses app_message var)
        └── app.conf.j2                # custom nginx site config
```

## Running It

```bash
# 1. Provision (same as Weekly Task, skip if already applied)
terraform init && terraform apply

# 2. Configure
cd ansible
ansible-playbook playbook.yml

# 3. Verify
curl http://127.0.0.1:8080
# Should show: "Hello from Terraform + Ansible - Version 1"
```

## What This Playbook Does Beyond the Weekly Task

1. Installs required packages + creates the application user (same as before)
2. Deploys a custom `index.html` from a Jinja2 template (real web content,
   not the nginx default page)
3. Deploys a custom nginx site config and **disables Ubuntu's default site**
   — without this step, nginx fails to start with a `duplicate default
   server` error, since both configs claim to be the default. This was a
   real bug caught while building this playbook; see the Implementation
   Summary PDF for the full failure/fix story.
4. Verifies the deployed page is actually being served (not just that tasks
   "succeeded") using Ansible's `uri` module to make a real HTTP request

## Demonstrating a Config Change Through Ansible Only

This is the activity's core requirement — proving a change can be applied
without manually touching the server:

```bash
# Edit ansible/playbook.yml, change:
app_message: "Hello from Terraform + Ansible - Version 1"
# to:
app_message: "Hello from Terraform + Ansible - Version 2 (Updated!)"

# Re-run — same command, nothing done manually on the server:
ansible-playbook playbook.yml

# Verify the change took effect:
curl http://127.0.0.1:8080
```

Watch the Ansible output closely: only the tasks that depend on
`app_message` (deploying the template, restarting nginx) report `changed`.
Everything else reports `ok`, proving Ansible only touches what actually
needs to change — this is idempotency in action.

## Workflow

```
Terraform → Infrastructure → Ansible → Server Configuration → Application
```

Terraform creates the container (Infrastructure). Ansible connects to it and
installs/configures everything (Server Configuration). The end result is a
running, correctly configured nginx server serving custom content
(Application) — achieved entirely through code, with zero manual server
setup at any point.
