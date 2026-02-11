# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

tags = [ "Ruby", "Rails", "JavaScript", "TypeScript", "React", "Astro", "Docker", "PostgreSQL", "CSS", "Git" ].map { |name|
  [ name, Tag.find_or_create_by!(name: name) ]
}.to_h

blogs_data = [
  {
    title: "Railsで始めるAPI開発入門",
    description: "RailsのAPIモードを活用したAPI開発の基本を解説",
    content: "RailsはAPIモードを使うことで、軽量なAPIサーバーを構築できます。今回はActionController::APIを活用した実装方法を解説します。",
    author: "田中太郎",
    published_at: Time.zone.parse("2026-01-05 10:00"),
    tags: [ tags["Ruby"], tags["Rails"] ]
  },
  {
    title: "Reactの状態管理を見直す",
    description: "useState・useReducer・Context APIなどReactの状態管理手法を比較",
    content: "useStateやuseReducerだけでなく、Context APIやサードパーティライブラリを含めたReactの状態管理手法を比較します。",
    author: "佐藤花子",
    published_at: Time.zone.parse("2026-01-08 09:00"),
    tags: [ tags["React"], tags["JavaScript"] ]
  },
  {
    title: "Docker Composeで開発環境を統一する",
    description: "Docker ComposeでRails+PostgreSQL環境を構築する手順",
    content: "チーム全員が同じ開発環境を使えるように、Docker Composeで Rails + PostgreSQL の環境を構築する方法を紹介します。",
    author: "鈴木一郎",
    published_at: Time.zone.parse("2026-01-10 14:00"),
    tags: [ tags["Docker"], tags["Rails"], tags["PostgreSQL"] ]
  },
  {
    title: "TypeScriptの型パズルを攻略する",
    description: "Conditional TypesやTemplate Literal Typesなど高度な型機能を解説",
    content: "Conditional TypesやTemplate Literal Typesなど、TypeScriptの高度な型機能を実践的な例とともに解説します。",
    author: "高橋美咲",
    published_at: Time.zone.parse("2026-01-12 11:00"),
    tags: [ tags["TypeScript"] ]
  },
  {
    title: "Astroで爆速な静的サイトを作る",
    description: "Astroのアイランドアーキテクチャで高速Webサイトを構築",
    content: "Astroのアイランドアーキテクチャを使って、パフォーマンスに優れたWebサイトを構築する方法を紹介します。",
    author: "田中太郎",
    published_at: Time.zone.parse("2026-01-15 08:30"),
    tags: [ tags["Astro"], tags["JavaScript"] ]
  },
  {
    title: "PostgreSQLのインデックス戦略",
    description: "B-tree・GIN・GiSTの使い分けとクエリ最適化の手法",
    content: "B-tree、GIN、GiSTなどのインデックスタイプの使い分けと、EXPLAINを使ったクエリ最適化の手法を解説します。",
    author: "佐藤花子",
    published_at: Time.zone.parse("2026-01-18 13:00"),
    tags: [ tags["PostgreSQL"] ]
  },
  {
    title: "CSS Gridで複雑なレイアウトを簡単に",
    description: "CSS Gridの実用的なレイアウトパターンを5つ紹介",
    content: "CSS Gridを使えば、複雑なレイアウトも直感的に実装できます。実用的なパターンを5つ紹介します。",
    author: "山田次郎",
    published_at: Time.zone.parse("2026-01-20 10:00"),
    tags: [ tags["CSS"] ]
  },
  {
    title: "Gitブランチ戦略の選び方",
    description: "Git Flow・GitHub Flow・Trunk Basedなどブランチ戦略を比較",
    content: "Git Flow、GitHub Flow、Trunk Based Developmentなど、チーム規模やリリース頻度に合わせたブランチ戦略を比較します。",
    author: "鈴木一郎",
    published_at: Time.zone.parse("2026-01-22 09:30"),
    tags: [ tags["Git"] ]
  },
  {
    title: "RailsのN+1問題を根絶する",
    description: "includes・preload・eager_loadの違いとBulletgemの活用法",
    content: "includes、preload、eager_loadの違いを理解し、Bulletgemを活用してN+1クエリを検出・修正する方法を紹介します。",
    author: "田中太郎",
    published_at: Time.zone.parse("2026-01-25 15:00"),
    tags: [ tags["Ruby"], tags["Rails"], tags["PostgreSQL"] ]
  },
  {
    title: "React Server Componentsの実践",
    description: "サーバーとクライアントのレンダリングを最適に組み合わせる方法",
    content: "React Server Componentsを使って、サーバーサイドとクライアントサイドのレンダリングを最適に組み合わせる方法を解説します。",
    author: "高橋美咲",
    published_at: Time.zone.parse("2026-01-28 10:00"),
    tags: [ tags["React"], tags["TypeScript"] ]
  },
  {
    title: "Dockerマルチステージビルドで軽量イメージを作る",
    description: "マルチステージビルドで本番用イメージサイズを大幅削減",
    content: "マルチステージビルドを活用して、本番用のDockerイメージサイズを大幅に削減するテクニックを紹介します。",
    author: "鈴木一郎",
    published_at: Time.zone.parse("2026-01-30 11:00"),
    tags: [ tags["Docker"] ]
  },
  {
    title: "Rubyのパターンマッチングでコードをすっきり書く",
    description: "Ruby 3系のパターンマッチングで条件分岐を読みやすく改善",
    content: "Ruby 3系で強化されたパターンマッチング機能を活用して、条件分岐を読みやすく書き換える方法を紹介します。",
    author: "佐藤花子",
    published_at: Time.zone.parse("2026-02-01 09:00"),
    tags: [ tags["Ruby"] ]
  },
  {
    title: "AstroにReactコンポーネントを組み込む",
    description: "Astroのインテグレーションで既存Reactコンポーネントを活用",
    content: "Astroのインテグレーション機能を使って、既存のReactコンポーネントを静的サイト内で活用する方法を解説します。",
    author: "山田次郎",
    published_at: Time.zone.parse("2026-02-02 14:30"),
    tags: [ tags["Astro"], tags["React"] ]
  },
  {
    title: "CSS Container Queriesの活用法",
    description: "Container Queriesでコンポーネント単位のレスポンシブを実現",
    content: "メディアクエリだけでなく、Container Queriesを使ってコンポーネント単位でレスポンシブデザインを実現する方法を紹介します。",
    author: "高橋美咲",
    published_at: Time.zone.parse("2026-02-03 10:00"),
    tags: [ tags["CSS"] ]
  },
  {
    title: "Railsのセキュリティ対策チェックリスト",
    description: "SQLi・XSS・CSRFなどRails開発のセキュリティ対策まとめ",
    content: "SQLインジェクション、XSS、CSRFなど、Rails開発で押さえておくべきセキュリティ対策をチェックリスト形式でまとめます。",
    author: "田中太郎",
    published_at: Time.zone.parse("2026-02-04 13:00"),
    tags: [ tags["Rails"], tags["Ruby"] ]
  },
  {
    title: "JavaScriptの非同期処理を完全理解する",
    description: "Promise・async/await・イベントループの仕組みを図解で解説",
    content: "Promise、async/await、そしてイベントループの仕組みを図解付きで解説します。",
    author: "佐藤花子",
    published_at: Time.zone.parse("2026-02-05 09:00"),
    tags: [ tags["JavaScript"] ]
  },
  {
    title: "PostgreSQLのJSONB型を使いこなす",
    description: "JSONB型のインデックス設定やクエリの実践テクニック",
    content: "JSONB型のカラムに対するインデックス設定やクエリの書き方など、実践的なテクニックを紹介します。",
    author: "鈴木一郎",
    published_at: Time.zone.parse("2026-02-06 11:00"),
    tags: [ tags["PostgreSQL"], tags["Rails"] ]
  },
  {
    title: "Gitの履歴をきれいに保つrebaseの使い方",
    description: "interactive rebaseでコミット履歴を整理するテクニック",
    content: "interactive rebaseを使ってコミット履歴を整理し、レビューしやすいPRを作るためのテクニックを紹介します。",
    author: "山田次郎",
    published_at: Time.zone.parse("2026-02-07 10:00"),
    tags: [ tags["Git"] ]
  },
  {
    title: "React HooksでカスタムHookを設計する",
    description: "再利用可能でテストしやすいカスタムHookの設計パターン",
    content: "再利用可能なカスタムHookの設計パターンと、テストしやすいHookの書き方を紹介します。",
    author: "高橋美咲",
    published_at: Time.zone.parse("2026-02-09 14:00"),
    tags: [ tags["React"], tags["TypeScript"], tags["JavaScript"] ]
  },
  {
    title: "Rails + Astroでモダンなフルスタック構成を作る",
    description: "Rails APIとAstroフロントエンドの構築手順とメリット",
    content: "バックエンドにRails API、フロントエンドにAstroを採用したアーキテクチャの構築手順とメリットを解説します。",
    author: "田中太郎",
    published_at: Time.zone.parse("2026-02-10 10:00"),
    tags: [ tags["Rails"], tags["Astro"], tags["TypeScript"] ]
  }
]

blogs_data.each do |data|
  blog_tags = data.delete(:tags)
  blog = Blog.find_or_initialize_by(title: data[:title])
  blog.update!(data)
  blog.tags = blog_tags
end

puts "Seeded #{Blog.count} blogs and #{Tag.count} tags."
