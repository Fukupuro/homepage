class RenameDiscriptionColumnToBlogs < ActiveRecord::Migration[8.1]
  def change
    rename_column :blogs, :discription, :description
  end
end
