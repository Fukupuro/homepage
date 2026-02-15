require "test_helper"

class Admin::BlogsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @blog = blogs(:one)

    # Basic認証の認証情報を設定
    @auth_credentials = ActionController::HttpAuthentication::Basic.encode_credentials(
      ENV.fetch("ADMIN_USER", "admin"),
      ENV.fetch("ADMIN_PASSWORD", "password")
    )
  end

  # ===== index =====
  test "should get index" do
    get admin_blogs_url, headers: { "Authorization" => @auth_credentials }
    assert_response :success
  end

  # ===== show =====
  test "should get show" do
    get admin_blog_url(@blog), headers: { "Authorization" => @auth_credentials }
    assert_response :success
  end

  # ===== new =====
  test "should get new" do
    get new_admin_blog_url, headers: { "Authorization" => @auth_credentials }
    assert_response :success
  end

  # ===== create =====
  test "should create blog" do
    assert_difference("Blog.count", 1) do
      post admin_blogs_url,
        params: {
          blog: {
            title: "新しい記事",
            content: "新しい本文",
            author: "新しい著者",
            description: "新しい概要",
            published_at: Time.current
          }
        },
        headers: { "Authorization" => @auth_credentials }
    end
    assert_redirected_to admin_blog_url(Blog.last)
  end

  # ===== edit =====
  test "should get edit" do
    get edit_admin_blog_url(@blog), headers: { "Authorization" => @auth_credentials }
    assert_response :success
  end

  # ===== update =====
  test "should update blog" do
    patch admin_blog_url(@blog),
      params: {
        blog: {
          title: "更新されたタイトル"
        }
      },
      headers: { "Authorization" => @auth_credentials }
    assert_redirected_to admin_blog_url(@blog)
  end

  # ===== destroy =====
  test "should destroy blog" do
    assert_difference("Blog.count", -1) do
      delete admin_blog_url(@blog),
        headers: { "Authorization" => @auth_credentials }
    end
    assert_redirected_to admin_blogs_url
  end

  # ===== 認証なしでアクセスした場合 =====
  test "should require authentication" do
    get admin_blogs_url
    assert_response :unauthorized
  end
end
