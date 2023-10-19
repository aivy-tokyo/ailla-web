# AILLA (Next.js & TypeScriptによるWebアプリ)

  ## プロジェクトの説明
  AILLAはNext.jsとTypeScriptを用いて開発されたウェブアプリケーションです。大規模アプリケーションのためのJavaScriptライブラリ「React」をベースとしたNe…

  ## 使用技術
  - Next.js
  - TypeScript
  - API (pages/api フォルダ参照)
  - VRM 人間形状モデル (public/vrm フォルダ参照)
  - jotai (状態管理)
  - next-auth (認証とセッション管理)
  - @sentry/nextjs（エラートラッキングとログ管理）
  - yarn (パッケージ管理)

  ## 実装詳細
  - AILLAのエントリーポイントは `pages/_app.tsx` ファイルです。
  - 背景画像の状態管理には jotai を使用しています。
  - 認証とセッション管理には next-auth を使用しています。
  - sentry はエラートラッキングとログ管理を行うためのツールで、プロジェクトの実行環境に基づいて設定されています。
  - レンダリング後にスクロール位置をページの先頭に強制する機能があります。
  - `/{pathname}` パスでどのページでも背景画像を設定します。

  ## セットアップ手順
  1. Git を使ってリポジトリをcloneします。
  2. `yarn install` で package.json にリストされているパッケージを全てインストールします。
  3. `yarn dev` を実行して開発サーバーを起動します。

  ## 使用方法
  開発サーバーが起動していれば、ブラウザから http://localhost:3000/ でアプリケーションにアクセスできます。