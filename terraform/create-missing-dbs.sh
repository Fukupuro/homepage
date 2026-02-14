#!/bin/bash
# 既存の DB ボリュームに cache/queue/cable が無い場合に、不足分だけ作成するスクリプト
# サーバー上で: cd /opt/homepage/cms && bash create-missing-dbs.sh
# 実行後: sudo docker compose -f docker-compose.prod.yml --env-file .env.production up -d cms

set -e

if [ -n "${CMS_DIR+set}" ]; then
  [ -f "$CMS_DIR/docker-compose.prod.yml" ] || { echo "docker-compose.prod.yml が $CMS_DIR に見つかりません"; exit 1; }
else
  CMS_DIR=/opt/homepage
  [ -f "$CMS_DIR/docker-compose.prod.yml" ] || { echo "docker-compose.prod.yml が見つかりません"; exit 1; }
fi

cd "$CMS_DIR"
ENV_FILE=".env.production"
[ -f "$ENV_FILE" ] || { echo "$ENV_FILE がありません"; exit 1; }

for db in cms_production_cache cms_production_queue cms_production_cable; do
  sudo docker compose -f docker-compose.prod.yml --env-file .env.production exec db psql -v ON_ERROR_STOP=0 -U cms -d cms_production -c "CREATE DATABASE $db;" || true
done
for db in cms_production_cache cms_production_queue cms_production_cable; do
  sudo docker compose -f docker-compose.prod.yml --env-file .env.production exec db psql -v ON_ERROR_STOP=1 -U cms -d cms_production -c "GRANT ALL PRIVILEGES ON DATABASE $db TO cms;"
done
echo "DB 作成完了。Rails を再起動: sudo docker compose -f docker-compose.prod.yml --env-file .env.production up -d cms"
