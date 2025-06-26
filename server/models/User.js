const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    resetToken: String, // パスワードリセット用トークン
    resetTokenExpires: Date, // トークンの有効期限
  },
  { timestamps: true } // ✅ これを追加！
);

// パスワードを保存前にハッシュ化するMongooseのpreフック
UserSchema.pre("save", async function (next) {
  // パスワードが変更されていない場合は、ハッシュ化せずに次へ
  if (!this.isModified("password")) return next();
  // パスワードをハッシュ化
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
