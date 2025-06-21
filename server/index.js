const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const memoRoutes = require("./routes/memos");
const authRoutes = require("./routes/auth"); // ← 認証ルートを追加
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

// ルーティング
app.use("/api/memos", memoRoutes);
app.use("/api", authRoutes); // ← 追加された認証ルート

// デフォルトのルート（任意）
app.get("/", (req, res) => {
  res.send("Hello from Memo App!");
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
