# =============================================================================
# variables.tf - Week 6 Weekly Task
# =============================================================================

variable "container_name" {
  description = "Name given to the provisioned Docker container (our 'server')"
  type        = string
  default     = "week6-app-server"
}

variable "ssh_port" {
  description = "Host port mapped to the container's SSH port (22), used by Ansible to connect"
  type        = number
  default     = 2222
}

variable "http_port" {
  description = "Host port mapped to the container's HTTP port (80), used to reach the web server Ansible will install"
  type        = number
  default     = 8080
}
