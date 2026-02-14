variable "sakuracloud_token" {
  type        = string
  description = "Sakura Cloud API トークン"
}

variable "sakuracloud_secret" {
  type        = string
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

variable "git_repo_url" {
  type        = string
  description = "デプロイするリポジトリの URL"
}

variable "git_ref" {
  type        = string
  default     = "main"
  description = "デプロイするブランチまたはタグ"
}

variable "deploy_trigger" {
  type        = string
  default     = ""
  description = "再デプロイ用。値を変えると deploy_app が再実行される（例: -var='deploy_trigger=$(git rev-parse HEAD)' または -var='deploy_trigger=1'）"
}
