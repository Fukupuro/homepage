class Admin::BlogsController < ApplicationController
  before_action :set_blog, only: %i[show edit update destroy]

  PER_PAGE = 9

  def index
    @page = [ params.fetch(:page, 1).to_i, 1 ].max
    all_blogs = Blog.includes(:tags).order(published_at: :desc)
    @total_count = all_blogs.count
    @total_pages = (@total_count.to_f / PER_PAGE).ceil
    @page = [ @page, @total_pages ].min if @total_pages > 0
    @blogs = all_blogs.offset((@page - 1) * PER_PAGE).limit(PER_PAGE)
  end

  def show
  end

  def new
    @blog = Blog.new
  end

  def create
    @blog = Blog.new(blog_params)

    if save_blog_with_tags
      redirect_to admin_blog_path(@blog), notice: "ブログを作成しました。"
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    @blog.assign_attributes(blog_params)

    if save_blog_with_tags
      redirect_to admin_blog_path(@blog), notice: "ブログを更新しました。"
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @blog.destroy!
    redirect_to admin_blogs_path, notice: "ブログを削除しました。"
  end

  private

  def set_blog
    @blog = Blog.find(params[:id])
  end

  def save_blog_with_tags
    saved = false

    ActiveRecord::Base.transaction do
      assign_tags
      if @blog.save
        saved = true
      else
        raise ActiveRecord::Rollback
      end
    end

    saved
  end

  def assign_tags
    return unless params[:blog]&.key?(:tag_names)

    tag_names = Array(params[:blog][:tag_names]).map(&:strip).reject(&:empty?)
    @blog.tags = tag_names.map { |name| Tag.find_or_create_by(name: name) }
  end

  def blog_params
    params.require(:blog).permit(:title, :description, :content, :author, :published_at, :header_image)
  end
end
