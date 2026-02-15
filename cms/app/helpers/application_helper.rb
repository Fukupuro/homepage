module ApplicationHelper
  def markdown(text)
    return "" if text.blank?

    renderer = Redcarpet::Render::HTML.new(
      hard_wrap: true,
      filter_html: false
    )
    md = Redcarpet::Markdown.new(renderer,
      autolink: true,
      fenced_code_blocks: true,
      tables: true,
      strikethrough: true,
      no_intra_emphasis: true)
    md.render(text).html_safe # rubocop:disable Rails/OutputSafety
  end

  # ページ番号の配列を生成（省略記号付き）
  def page_numbers_for(current, total)
    return (1..total).to_a if total <= 5

    pages = []
    pages << 1

    start = [ current - 1, 2 ].max
    finish = [ current + 1, total - 1 ].min

    pages << :ellipsis if start > 2
    (start..finish).each { |p| pages << p }
    pages << :ellipsis if finish < total - 1

    pages << total
    pages
  end
end
