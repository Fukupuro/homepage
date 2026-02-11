module Api
  class BlogsController < ActionController::API
    def index
      blogs = Blog.includes(:tags).order(published_at: :desc)
      render json: blogs.map { |blog|
        {
          id: blog.id,
          title: blog.title,
          description: blog.description,
          header_image_url: blog.header_image_url,
          content: blog.content,
          content_images_url: blog.content_images_url,
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
