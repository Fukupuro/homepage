class Blog < ApplicationRecord
  has_many :blog_tags, dependent: :destroy
  has_many :tags, through: :blog_tags

  has_one_attached :header_image
  has_many_attached :content_images

  validates :title, presence: true
  validates :description, presence: true

  scope :search_by_keyword, ->(keyword) {
    sanitized = "%#{sanitize_sql_like(keyword)}%"
    left_joins(:tags).where(
      "blogs.title LIKE ? OR blogs.content LIKE ? OR tags.name LIKE ? OR blogs.author LIKE ? OR blogs.description LIKE ?",
      sanitized, sanitized, sanitized, sanitized, sanitized
    ).distinct
  }

  scope :search_by_tag, ->(tag_name) {
    where(id: Blog.joins(:tags).where(tags: { name: tag_name }).select(:id))
  }

  scope :search_by_author, ->(author) {
    where("blogs.author LIKE ?", "%#{sanitize_sql_like(author)}%")
  }

  def header_image_url
    if header_image.attached?
      Rails.application.routes.url_helpers.rails_blob_url(header_image, only_path: true)
    else
      nil
    end
  end

  def content_images_urls
    if content_images.attached?
      content_images.map do |image|
        Rails.application.routes.url_helpers.rails_blob_url(image, only_path: true)
      end
    else
      []
    end
  end
end
