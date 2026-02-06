class ChangeTagsOnBlogs < ActiveRecord::Migration[8.1]
  def change
    change_column_null :blogs, :tags, false
  end
end
