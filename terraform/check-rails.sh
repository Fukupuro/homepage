#!/bin/bash
# Rails が実行できているか確認するコマンド集
# 使い方（手元）: ssh -i ~/.ssh/terraform_deploy ubuntu@<IP> 'bash -s' < terraform/check-rails.sh
# サーバー上: cd /opt/homepage/cms && bash /opt/homepage/terraform/check-rails.sh

set -e

CMS_DIR="${CMS_DIR:-/opt/homepage/cms}"
if [ ! -d "$CMS_DIR" ]; then
  CMS_DIR=/opt/homepage
  [ -f "$CMS_DIR/docker-compose.prod.yml" ] || { echo "CMS_DIR が見つかりません"; exit 1; }
fi

COMPOSE_ENV=""
[ -f "$CMS_DIR/.env.production" ] && COMPOSE_ENV="--env-file $CMS_DIR/.env.production"

echo "=== 1. Docker コンテナ状態 ==="
cd "$CMS_DIR" && sudo docker compose -f docker-compose.prod.yml $COMPOSE_ENV ps -a

echo ""
echo "=== 2. ポート 80 のリッスン状況 ==="
sudo ss -tlnp | grep ':80 ' || echo "（何も表示されていなければ 80 番でリッスンしていません）"

echo ""
echo "=== 3. サーバー内から HTTP 応答 (localhost:80) ==="
curl -s -o /dev/null -w "HTTP status: %{http_code}\n" --connect-timeout 3 http://127.0.0.1:80/ || echo "接続失敗"

echo ""
echo "=== 4. CMS (Rails) コンテナの直近ログ（先頭のエラー確認用に多め） ==="
cd "$CMS_DIR" && sudo docker compose -f docker-compose.prod.yml $COMPOSE_ENV logs --tail=80 cms

echo ""
echo "=== 5. DB コンテナの直近ログ ==="
cd "$CMS_DIR" && sudo docker compose -f docker-compose.prod.yml $COMPOSE_ENV logs --tail=15 db
