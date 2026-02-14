terraform {
  required_version = ">= 1.0"

  required_providers {
    sakuracloud = {
      source  = "sacloud/sakuracloud"
      version = "2.26.0"
    }
  }
}

provider "sakuracloud" {
  token = var.sakuracloud_token
  secret = var.sakuracloud_secret
  zone = "is1a"
}

# SSH公開鍵
resource "sakuracloud_ssh_key" "deploy" {
  name       = "deploy-key"
  public_key = file(pathexpand(var.ssh_public_key_path))
}

# ファイアウォール
resource "sakuracloud_packet_filter" "rails" {
  name = "rails-server-pf"
}

resource "sakuracloud_packet_filter_rules" "rails" {
  packet_filter_id = sakuracloud_packet_filter.rails.id

  expression {
    protocol         = "tcp"
    destination_port = "22"
    description      = "SSH"
  }

  expression {
    protocol         = "tcp"
    destination_port = "80"
    description      = "HTTP"
  }

  expression {
    protocol         = "tcp"
    destination_port = "443"
    description      = "HTTPS"
  }

  # 返送パケット許可（サーバーからの外向き通信の応答用）
  expression {
    protocol         = "tcp"
    destination_port = "32768-61000"
    description      = "Return TCP"
  }

  expression {
    protocol         = "udp"
    destination_port = "32768-61000"
    description      = "Return UDP"
  }
}

# サーバーの定義
resource "sakuracloud_server" "rails_app" {
  name   = "rails-server"
  core   = 1
  memory = 2
  disks  = [sakuracloud_disk.boot.id]

  network_interface {
    upstream         = "shared"
    packet_filter_id = sakuracloud_packet_filter.rails.id
  }

  disk_edit_parameter {
    hostname        = "rails-server"
    disable_pw_auth = true
    ssh_key_ids     = [sakuracloud_ssh_key.deploy.id]
  }
}

# ディスクの定義
resource "sakuracloud_disk" "boot" {
  name              = "boot-disk"
  size              = var.disk_size_gb
  source_archive_id = data.sakuracloud_archive.ubuntu.id
}

data "sakuracloud_archive" "ubuntu" {
  os_type = "ubuntu2204"
}

output "server_global_ip" {
  value       = sakuracloud_server.rails_app.ip_address
}
