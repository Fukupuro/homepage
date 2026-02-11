module Api
  class TagsController < ActionController::API
    def index
      tags_with_count = Tag.all.map do |tag|
        {
          id: tag.id,
          name: tag.name,
          count: tag.blogs.count
        }
      end

      sorted_tags = tags_with_count.sort_by { |tag| -tag[:count] }

      render json: { 
        tags: sorted_tags,
        count: sorted_tags.count
      }
    end
  end
end
