module Api
  class TagsController < ActionController::API
    def index
      tags_with_count = Tag
                        .left_joins(:blogs)
                        .group("tags.id", "tags.name")
                        .select("tags.id, tags.name, COUNT(blogs.id) AS blogs_count")
                        .order("blogs_count DESC")

      sorted_tags = tags_with_count.map do |tag|
        {
          id: tag.id,
          name: tag.name,
          count: tag.blogs_count.to_i
        }
      end

      render json: {
        tags: sorted_tags,
        count: sorted_tags.count
      }
    end
  end
end
