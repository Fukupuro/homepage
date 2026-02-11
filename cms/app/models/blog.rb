class Blog < ApplicationRecord
  has_many :blog_tags, dependent: :destroy
  has_many :tags, through: :blog_tags

  has_one_attached :header_image
  has_many_attached :content_images

  validates :title, presence: true
  validates :description, presence: true
end
