# =============================================================================
# outputs.tf - Week 6 Weekly Task
# =============================================================================

output "container_name" {
  description = "Name of the provisioned Docker container"
  value       = docker_container.app_server.name
}

output "ssh_connection_command" {
  description = "Command to manually SSH into the provisioned server"
  value       = "ssh root@127.0.0.1 -p ${var.ssh_port}"
}

output "app_url" {
  description = "URL to reach the web server once Ansible has configured it"
  value       = "http://127.0.0.1:${var.http_port}"
}

output "ansible_inventory_hint" {
  description = "Values to plug into the Ansible inventory file"
  value       = "ansible_host=127.0.0.1 ansible_port=${var.ssh_port} ansible_user=root"
}
