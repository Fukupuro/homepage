variable "sakuracloud_token" {
  type        = string
  sensitive   = true
  description = "Sakura Cloud API トークン"
}

variable "sakuracloud_secret" {
  type        = string
  sensitive   = true
  description = "Sakura Cloud API シークレット"
}

variable "ssh_public_key_path" {
  type        = string
  description = "サーバーに登録するSSH公開鍵ファイルのパス（例: ~/.ssh/id_rsa.pub）"
}

variable "disk_size_gb" {
  type        = number
  default     = 20
  description = "ブートディスクのサイズ（GiB）"
}

variable "ssh_private_key_path" {
  type        = string
  description = "SSH 秘密鍵のパス（例: ~/.ssh/id_rsa）。ubuntu ユーザーでサーバーに接続するために使用"
}

variable "rails_master_key" {
  type        = string
  sensitive   = true
  description = "Rails 本番用 RAILS_MASTER_KEY（cms/config/master.key の内容）"
}

variable "cms_database_password" {
  type        = string
  sensitive   = true
  description = "本番 PostgreSQL の CMS ユーザー用パスワード"
}

variable "basic_auth_user" {
  type        = string
  sensitive   = true
  description = "Rails 本番の Basic 認証ユーザー名（ApplicationController で必須）"
}

variable "basic_auth_password" {
  type        = string
  sensitive   = true
  description = "Rails 本番の Basic 認証パスワード"
}

variable "git_repo_url" {
  type        = string
  default     = "https://github.com/Fukupro2023/homepage.git"
  description = "デプロイするリポジトリの URL（GitHub HTTPS のみ）"

  validation {
    condition     = can(regex("^https://github\\.com/[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+(\\.git)?$", var.git_repo_url))
    error_message = "git_repo_url は https://github.com/owner/repo または https://github.com/owner/repo.git 形式の GitHub HTTPS URL である必要があります。"
  }
}

variable "git_ref" {
  type        = string
  default     = "main"
  description = "デプロイするブランチまたはタグ"

  validation {
    condition     = can(regex("^[a-zA-Z0-9._/\\-]+$", var.git_ref))
    error_message = "git_ref には英数字、ドット(.)、アンダースコア(_)、ハイフン(-)、スラッシュ(/) のみ使用できます。"
  }
}

variable "cors_origin" {
  type        = string
  description = "CORS で許可するオリジン"
}
