module Api
  class BlogsController < ActionController::API
    DEFAULT_LIMIT = 10
    MAX_LIMIT = 100
    MAX_SEARCH_TERMS = 10

    def index
      blogs = Blog.includes(:tags, header_image_attachment: :blob).order(published_at: :desc)
      render json: paginate(blogs)
    end

    def search
      blogs = Blog.includes(:tags, header_image_attachment: :blob).order(published_at: :desc)

      if params[:q].present?
        params[:q].split.first(MAX_SEARCH_TERMS).each do |term|
          case term
          when /\Atag:(.+)/
            blogs = blogs.search_by_tag($1)
          when /\Aauthor:(.+)/
            blogs = blogs.search_by_author($1)
          else
            blogs = blogs.search_by_keyword(term)
          end
        end
      end

      render json: paginate(blogs)
    end

    private

    def paginate(scope)
      limit = (params[:limit] || DEFAULT_LIMIT).to_i.clamp(1, MAX_LIMIT)
      page = [ params[:page].to_i, 1 ].max
      offset = (page - 1) * limit
      total_count = scope.count

      {
        data: serialize_blogs(scope.limit(limit).offset(offset)),
        meta: {
          current_page: page,
          total_pages: (total_count.to_f / limit).ceil,
          total_count: total_count,
          limit: limit
        }
      }
    end

    def serialize_blogs(blogs)
      blogs.map { |blog|
        {
          id: blog.id,
          title: blog.title,
          description: blog.description,
          header_image_url: blog.header_image_url,
          content: blog.content,
          # content_images_url: blog.content_images_url,
          author: blog.author,
          published_at: blog.published_at,
          tags: blog.tags.map(&:name),
          created_at: blog.created_at,
          updated_at: blog.updated_at
        }
      }
    end
  end
end
