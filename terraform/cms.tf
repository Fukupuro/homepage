terraform {
  required_version = ">= 1.0"

  required_providers {
    sakuracloud = {
      source  = "sacloud/sakuracloud"
      version = "2.26.0"
    }
    time = {
      source  = "hashicorp/time"
      version = "~> 0.9"
    }
    null = {
      source  = "hashicorp/null"
      version = "~> 3.0"
    }
    local = {
      source  = "hashicorp/local"
      version = "~> 2.0"
    }
  }
}

provider "sakuracloud" {
  token  = var.sakuracloud_token
  secret = var.sakuracloud_secret
  zone   = "is1a"
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
  core   = 4
  memory = 8
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

# サーバー起動待ち（SSH が有効になるまで）
resource "time_sleep" "wait_boot" {
  create_duration = "90s"
  depends_on      = [sakuracloud_server.rails_app]
}

# 本番用 .env
resource "local_file" "env_production" {
  content         = <<-EOT
RAILS_MASTER_KEY=${var.rails_master_key}
CMS_DATABASE_PASSWORD=${var.cms_database_password}
BASIC_AUTH_USER=${var.basic_auth_user}
BASIC_AUTH_PASSWORD=${var.basic_auth_password}
CORS_ORIGIN=${var.cors_origin}
EOT
  filename        = "${path.module}/.env.production.generated"
  file_permission = "0600"
}

# サーバー上に Docker・git を導入し /opt/homepage を準備（アプリはここに git clone）
resource "null_resource" "deploy_setup" {
  depends_on = [time_sleep.wait_boot]

  connection {
    type        = "ssh"
    user        = "ubuntu"
    host        = sakuracloud_server.rails_app.ip_address
    private_key = file(pathexpand(var.ssh_private_key_path))
  }

  provisioner "remote-exec" {
    inline = [
      "curl -fsSL https://get.docker.com | sudo sh",
      "sudo apt-get update -qq && sudo apt-get install -y git",
      "sudo mkdir -p /opt/homepage",
      "sudo chown ubuntu:ubuntu /opt/homepage",
    ]
  }
}

# CMS アプリを git clone で /opt/homepage に取得し、Docker Compose で起動
resource "null_resource" "deploy_app" {
  depends_on = [null_resource.deploy_setup, local_file.env_production]

  triggers = {
    repo = var.git_repo_url
    ref  = var.git_ref
    env  = local_file.env_production.content_sha256
  }

  connection {
    type        = "ssh"
    user        = "ubuntu"
    host        = sakuracloud_server.rails_app.ip_address
    private_key = file(pathexpand(var.ssh_private_key_path))
  }

  provisioner "file" {
    source      = "${path.module}/.env.production.generated"
    destination = "/tmp/.env.production"
  }

  provisioner "remote-exec" {
    inline = [
      "set -e",
      "command -v docker >/dev/null 2>&1 || curl -fsSL https://get.docker.com | sudo sh",
      "sudo mkdir -p /opt/homepage && sudo chown ubuntu:ubuntu /opt/homepage",
      "CMS_DIR=/opt/homepage/cms",
      "if [ -d /opt/homepage/.git ]; then cd /opt/homepage && git fetch origin && git checkout ${var.git_ref} && (git pull origin ${var.git_ref} 2>/dev/null || true); else git clone --depth 1 --branch ${var.git_ref} ${var.git_repo_url} /opt/homepage; fi",
      "sudo mv /tmp/.env.production $CMS_DIR/.env.production",
      "sudo chown ubuntu:ubuntu $CMS_DIR/.env.production",
      "chmod +x $CMS_DIR/init-db.sh 2>/dev/null || true",
      "sed -i 's/\\r$//' $CMS_DIR/init-db.sh 2>/dev/null || true",
      "cd $CMS_DIR && sudo docker compose -f docker-compose.prod.yml --env-file .env.production build --no-cache",
      "cd $CMS_DIR && sudo docker compose -f docker-compose.prod.yml --env-file .env.production up -d db",
      "cd $CMS_DIR && (set +e; ok=0; for i in $(seq 1 60); do if sudo docker compose -f docker-compose.prod.yml --env-file .env.production exec -T db pg_isready -U cms -d cms_production; then ok=1; break; fi; sleep 5; done; set -e; [ \"$ok\" = 1 ] || exit 1)",
      "cd $CMS_DIR && sudo docker compose -f docker-compose.prod.yml --env-file .env.production up -d",
    ]
  }
}

output "server_global_ip" {
  value = sakuracloud_server.rails_app.ip_address
}

output "app_url" {
  value       = "http://${sakuracloud_server.rails_app.ip_address}"
  description = "Rails アプリの公開 URL（HTTP）"
}
