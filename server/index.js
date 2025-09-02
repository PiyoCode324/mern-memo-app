// server/index.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path"); // Node.js標準モジュール: ファイルパスを扱うためのユーティリティ
const memoRoutes = require("./routes/memos"); // メモ関連のルーティングモジュール
const authRoutes = require("./routes/auth"); // 認証関連のルーティングモジュール
const userRoutes = require("./routes/users"); // ユーザー関連のルーティングモジュール
require("dotenv").config(); // 環境変数を .env ファイルから読み込む

const app = express();
const PORT = process.env.PORT || 3000; // 環境変数 PORT があれば優先し、なければデフォルトで3000番を利用

// ==========================
// MongoDBへの接続処理
// ==========================
mongoose
  .connect(process.env.MONGODB_URI) // .env に定義された MongoDB の接続URIを使用
  .then(() => console.log("✅ MongoDB Connected")) // 接続成功
  .catch((err) => console.error("❌ MongoDB Connection Error:", err)); // 接続失敗

// ==========================
// ミドルウェアの設定
// ==========================
app.use(cors()); // CORS（クロスオリジンリソースシェアリング）を許可
app.use(express.json()); // JSON形式のリクエストボディを自動でパースするミドルウェア

// ==========================
// APIルーティングの設定
// ==========================
app.use("/api/memos", memoRoutes); // /api/memos/... → メモ関連の処理
app.use("/api/users", userRoutes); // /api/users/... → ユーザープロフィール関連の処理
app.use("/api", authRoutes); // /api/... → 認証関連の処理（例: /api/login, /api/register）

// ==========================
// Reactアプリのビルドファイルを配信
// ==========================
// Expressで client/build 内の静的ファイルを提供する。
// これにより、本番環境でバックエンドとフロントエンドを同一サーバーで動かせる。
app.use(express.static(path.join(__dirname, "../client/build")));

// ==========================
// SPA（シングルページアプリケーション）用フォールバックルート
// ==========================
// - /api で始まらないすべての GET リクエストに対して index.html を返却
// - React Router のクライアントサイドルーティングが機能するようにする
// - この処理は API ルートより後に置く必要がある
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// ==========================
// サーバー起動
// ==========================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
