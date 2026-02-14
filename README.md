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

```bash
cd /Users/itojum/user/univ/homepage
export RAILS_MASTER_KEY="$(cat cms/config/master.key)"
docker compose up --build
```

ブラウザで `http://localhost:3000` にアクセス。

※もし `cms/config/master.key` が存在しない場合は、事前に以下を一度実行して生成してください:

```bash
cd cms
bundle install
bin/rails credentials:edit
bin/dev
```

詳しい設定やコマンドは、必要になったときに追記してください。
