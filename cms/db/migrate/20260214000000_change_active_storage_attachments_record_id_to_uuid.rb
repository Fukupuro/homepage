class ChangeActiveStorageAttachmentsRecordIdToUuid < ActiveRecord::Migration[8.1]
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

    # bigint → text → uuid では無効値が残る可能性があるため、一旦 text 経由でカラム再作成
    add_column :active_storage_attachments, :record_id_uuid, :uuid
    execute "UPDATE active_storage_attachments SET record_id_uuid = record_id::text::uuid WHERE record_id::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'"
    remove_column :active_storage_attachments, :record_id
    rename_column :active_storage_attachments, :record_id_uuid, :record_id
    change_column_null :active_storage_attachments, :record_id, false

    add_index :active_storage_attachments, [ :record_type, :record_id, :name, :blob_id ],
              name: :index_active_storage_attachments_uniqueness, unique: true
  end

  def down
    remove_index :active_storage_attachments,
                 name: :index_active_storage_attachments_uniqueness

    add_column :active_storage_attachments, :record_id_bigint, :bigint
    remove_column :active_storage_attachments, :record_id
    rename_column :active_storage_attachments, :record_id_bigint, :record_id
    change_column_null :active_storage_attachments, :record_id, false

    add_index :active_storage_attachments, [ :record_type, :record_id, :name, :blob_id ],
              name: :index_active_storage_attachments_uniqueness, unique: true
  end
end
