// server/models/User.js

const mongoose = require("mongoose"); // CommonJS形式に変更
const bcrypt = require("bcrypt"); // CommonJS形式に変更

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // 重複登録防止
  },
  password: {
    type: String,
    required: true,
  },
});

// 保存前にパスワードをハッシュ化
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", UserSchema);

// CommonJS形式でエクスポート
module.exports = User; // <-- ここを `export default User;` から変更
