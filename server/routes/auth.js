const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

// POST /api/signup
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 既存ユーザー確認
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "すでに登録済みのメールアドレスです。" });
    }

    // 新規ユーザー作成（パスワードはモデルのpreフックで自動ハッシュ化）
    const newUser = new User({ email, password });
    await newUser.save();

    res.status(201).json({ message: "ユーザー登録が完了しました。" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "サーバーエラーが発生しました。" });
  }
});

// POST /api/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ユーザー存在チェック
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "メールアドレスかパスワードが間違っています。" });
    }

    // パスワード照合
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "メールアドレスかパスワードが間違っています。" });
    }

    // JWTトークン発行
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, message: "ログイン成功" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "サーバーエラーが発生しました。" });
  }
});

module.exports = router;
