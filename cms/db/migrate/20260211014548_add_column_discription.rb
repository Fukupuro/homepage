class AddColumnDiscription < ActiveRecord::Migration[8.1]
  def change
    add_column :blogs, :discription, :text
    remove_column :blogs, :link, :string
  end
end
