class Blog < ApplicationRecord
  has_many :blog_tags, dependent: :destroy
  has_many :tags, through: :blog_tags

  has_one_attached :header_image
  has_many_attached :content_images

  validates :title, presence: true
  validates :description, presence: true

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
