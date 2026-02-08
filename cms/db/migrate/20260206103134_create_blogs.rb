class CreateBlogs < ActiveRecord::Migration[8.1]
  def change
    create_table :blogs do |t|
      t.string :title, null: false
      t.text :content, null: false
      t.string :author
      t.string :link
      t.datetime :published_at

      t.timestamps
    end

    add_index :blogs, :published_at
    add_index :blogs, :author
  end
end
