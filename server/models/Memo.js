// server/models/Memo.js

const mongoose = require("mongoose");

const memoSchema = new mongoose.Schema(
  {
    userId: {
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
    category: {
      type: String,
      default: "",
    },
    isDone: {
      type: Boolean,
      default: false,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    attachments: [
      // ここを修正します
      new mongoose.Schema(
        {
          // 各添付ファイルをMongooseのサブスキーマとして明確に定義
          url: { type: String, required: true },
          name: { type: String, required: true },
          type: { type: String, required: true },
        },
        { _id: false }
      ), // _id: false を追加して、各添付ファイルオブジェクトに自動で_idを生成しないようにします
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Memo", memoSchema);
