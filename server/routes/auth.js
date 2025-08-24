// server/routes/auth.js

const express = require("express");
const crypto = require("crypto");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const router = express.Router();

// POST /api/signup
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for existing users
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "すでに登録済みのメールアドレスです。" });
    }

    // Create a new user (the password is automatically hashed in the model pre hook)
    const newUser = new User({ email, password });
    await newUser.save();

    res.status(201).json({ message: "ユーザー登録が完了しました。" });
  } catch (err) {
    console.error("サインアップエラー:", err);
    res.status(500).json({ message: "サーバーエラーが発生しました。" });
  }
});

// POST /api/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Checking if a user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "メールアドレスかパスワードが間違っています。" });
    }

    // Verify Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "メールアドレスかパスワードが間違っています。" });
    }

    // Issuing a JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, message: "ログイン成功" });
  } catch (err) {
    console.error("ログインエラー:", err);
    res.status(500).json({ message: "サーバーエラーが発生しました。" });
  }
});

/**
 * POST /api/password-reset-request
 * メールアドレスを受け取り、リセットトークンを生成し、メールでURLを送信します。
 * 送信するURLは、フロントエンドのReactコンポーネントがクエリパラメータ形式でトークンを読み取れるようにします。
 */
router.post("/password-reset-request", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      // セキュリティ上の理由から、ユーザーが存在しない場合でも成功レスポンスを返します。
      return res.status(200).json({
        message: "（存在する場合）パスワードリセットメールを送信しました。",
      });
    }

    // Token Generation
    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpires = Date.now() + 1000 * 60 * 60; // Expires after 1 hour
    await user.save();

    // Email sending settings (using SMTP such as Nodemailer and Mailtrap)
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io", // For development: Mailtrap example
      port: 2525,
      auth: {
        user: process.env.MAIL_USER, // Set it in the environment variables
        pass: process.env.MAIL_PASS,
      },
    });

    // Generate a link to a password reset form
    // Convert it into a query parameter format so that React's useSearchParams can read it.
    const resetLink = `http://localhost:3000/password-reset?token=${token}`;

    await transporter.sendMail({
      from: '"Your App" <no-reply@yourapp.com>',
      to: user.email,
      subject: "パスワードリセットのご案内",
      html: `<p>以下のリンクからパスワードリセットを行ってください：</p>
             <a href="${resetLink}">${resetLink}</a>
             <p>※リンクの有効期限は1時間です。</p>`,
    });

    res
      .status(200)
      .json({ message: "パスワードリセットメールを送信しました。" });
  } catch (err) {
    console.error("リセットリクエストエラー:", err);
    res.status(500).json({ message: "サーバーエラーが発生しました。" });
  }
});

/**
 * POST /api/password-reset
 * トークンと新パスワードを受け取り、パスワードを更新します。
 * このエンドポイントは、ReactフロントエンドのPasswordResetコンポーネントから呼び出されます。
 */
router.post("/password-reset", async (req, res) => {
  const { token, newPassword } = req.body; // Get the token and new password from the POST request body.

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() }, // Check if the token's expiration date is later than the current time
    });

    if (!user) {
      return res.status(400).json({
        message:
          "無効なリンク、または有効期限が切れています。再度パスワードリセットを要求してください。",
      });
    }

    // ここを修正: newPassword（平文）をuser.passwordに設定し、
    // ハッシュ化はUserモデルのpre('save')フックに任せる
    user.password = newPassword; // <-- 修正点

    // Clear used tokens and expiration dates
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save(); // The pre('save') hook runs here and the password is hashed.

    res.json({ message: "パスワードが正常にリセットされました。" });
  } catch (err) {
    console.error("パスワードリセットエラー:", err);
    res.status(500).json({ message: "サーバーエラーが発生しました。" });
  }
});

module.exports = router;
