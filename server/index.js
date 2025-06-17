// server/index.js
require('dotenv').config();
const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const memoRoutes = require('./routes/memos');   // ← ここだけで十分

const app  = express();
const PORT = process.env.PORT || 3000;

// MongoDB へ接続
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ミドルウェア
app.use(cors());
app.use(express.json());

// ルーティング
app.use('/api/memos', memoRoutes);

// 動作確認用
app.get('/', (req, res) => {
  res.send('Hello from Memo App!');
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
