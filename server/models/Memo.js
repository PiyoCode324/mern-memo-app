// server/models/Memo.js

const mongoose = require("mongoose");

const memoSchema = new mongoose.Schema(
  {
    userId: {
      // <-- この行を追加します
      type: mongoose.Schema.Types.ObjectId, // ユーザーIDはMongoDBのObjectId型です
      ref: "User", // 'User'モデルへの参照を示します (任意ですが良い習慣です)
      required: true, // このフィールドを必須にする場合は true に設定します
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isDone: {
      type: Boolean,
      default: false,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Memo", memoSchema);
