module Api
  class BlogsController < ActionController::API
    def index
      blogs = Blog.includes(:tags).order(published_at: :desc)
      render json: blogs.map { |blog|
        {
          id: blog.id,
          title: blog.title,
          description: blog.description,
          content: blog.content,
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
