# homepage

福プロのホームページのリポジトリです。

- `astro/` … フロントエンド（Astro）
- `cms/` … 管理用 CMS（Rails + PostgreSQL、Docker コンテナ）

---

## 起動方法

### Astro フロント

```bash
cd astro
pnpm install
pnpm dev
```

ブラウザで `http://localhost:4321` にアクセス。

### CMS（Rails + PostgreSQL, Docker）

#### 初期設定

`.env.example` をコピーして `.env` を作成し、必要な環境変数を設定してください。
`RAILS_MASTER_KEY` は `cms/config/master.key` の内容をメンバーから共有してもらって設定してください。

```bash
cd cms
bundle install
docker compose up --build
```

ブラウザで `http://localhost:3000` にアクセス

---

## Terraform（本番インフラ・Sakura Cloud）

CMS 用サーバーなどを Sakura Cloud 上に構築する場合の手順です。

### 前提

- [Terraform](https://www.terraform.io/downloads) をインストール済みであること
- Sakura Cloud の API トークン・シークレットを用意していること

### 手順

1. **変数ファイルの準備**

   ```bash
   cd terraform
   cp terraform.tfvars.example terraform.tfvars
   ```

   `terraform.tfvars` を編集し、API トークン・SSH 鍵パス・Rails の master key・DB パスワード・Basic 認証など必要な値を設定する。

2. **初期化と実行**

   ```bash
   terraform init
   terraform plan   # 変更内容を確認
   terraform apply  # 実行（yes で適用）
   ```

3. **破棄する場合**

   ```bash
   terraform destroy
   ```
