const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path"); // pathモジュールをインポート
const memoRoutes = require("./routes/memos");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB接続
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ミドルウェア
app.use(cors());
app.use(express.json());

// ルーティング (APIエンドポイント)
app.use("/api/memos", memoRoutes); // メモ関連のAPIルート
app.use("/api/users", userRoutes);
app.use("/api", authRoutes); // 認証関連のAPIルート

// Reactアプリケーションの静的ファイルをサーブ
app.use(express.static(path.join(__dirname, "../client/build"))); // <-- コメントを外す

// SPAのためのフォールバックルート:
// /api で始まらないすべてのGETリクエストに対して、Reactアプリケーションのindex.htmlを返します。
// これにより、React Routerがクライアント側でルーティングを処理できるようになります。
// このルートは、他のAPIルート (app.use("/api", ...)) の後に配置することが重要です。
app.get("*", (req, res) => {
  // <-- コメントを外す
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
