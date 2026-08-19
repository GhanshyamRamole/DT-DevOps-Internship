# =============================================================================
# main.tf - Week 6 Weekly Task
# Provisions a Docker container acting as an "application server" that
# Ansible will later connect to and configure via SSH.
# =============================================================================

terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

# Configure the Docker provider to talk to the local Docker daemon
provider "docker" {}

# Build a custom image from the Dockerfile in ./docker (Ubuntu + SSH server)
resource "docker_image" "app_server" {
  name = "week6-app-server:latest"
  build {
    context = "${path.module}/docker"
  }
}

# Run a container from that image - this is our "provisioned server"
resource "docker_container" "app_server" {
  name  = var.container_name
  image = docker_image.app_server.image_id

  ports {
    internal = 22
    external = var.ssh_port
  }

  ports {
    internal = 80
    external = var.http_port
  }
}
