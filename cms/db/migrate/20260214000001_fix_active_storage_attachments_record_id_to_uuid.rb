class FixActiveStorageAttachmentsRecordIdToUuid < ActiveRecord::Migration[8.1]
  def up
    # 既存の record_id は bigint に切り詰められており UUID として無効なので削除する
    execute <<~SQL
      DELETE FROM active_storage_attachments
      WHERE record_type = 'Blog'
        AND NOT EXISTS (
          SELECT 1 FROM blogs WHERE blogs.id::text = active_storage_attachments.record_id::text
        )
    SQL

    remove_index :active_storage_attachments,
                 name: :index_active_storage_attachments_uniqueness

    add_column :active_storage_attachments, :record_id_uuid, :uuid

    # LOWER() で大文字 UUID にも対応する
    execute <<~SQL
      UPDATE active_storage_attachments
      SET record_id_uuid = LOWER(record_id::text)::uuid
      WHERE LOWER(record_id::text) ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    SQL

    # 変換できなかった行があればマイグレーションを中止
    execute <<~SQL
      DO $$
      BEGIN
        IF EXISTS(SELECT 1 FROM active_storage_attachments WHERE record_id_uuid IS NULL) THEN
          RAISE EXCEPTION 'record_id_uuid が NULL のレコードがあります。変換できなかったデータを確認してください。';
        END IF;
      END$$;
    SQL

    remove_column :active_storage_attachments, :record_id
    rename_column :active_storage_attachments, :record_id_uuid, :record_id
    change_column_null :active_storage_attachments, :record_id, false

    add_index :active_storage_attachments, [ :record_type, :record_id, :name, :blob_id ],
              name: :index_active_storage_attachments_uniqueness, unique: true
  end

  def down
    raise ActiveRecord::IrreversibleMigration,
          "UUID への変換後のロールバックはサポートされていません。手動復旧が必要です。"
  end
end
