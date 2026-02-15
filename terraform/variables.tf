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
