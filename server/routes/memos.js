// server/routes/memos.js

const express = require("express");
const verifyToken = require("../middleware/verifyToken"); // JWT認証ミドルウェアをインポート
const Memo = require("../models/Memo"); // Memoモデルをインポート

const router = express.Router();

// 🔍 すべてのメモを取得 (認証必須) - GET /api/memos
router.get("/", verifyToken, async (req, res) => {
  try {
    // ログイン中のユーザーIDに紐づくメモのみを取得
    const memos = await Memo.find({ userId: req.user.userId });
    res.json({ memos });
  } catch (err) {
    console.error("メモ取得エラー:", err);
    res
      .status(500)
      .json({ message: "メモの取得中にサーバーエラーが発生しました。" });
  }
});

// ✏️ 新しいメモを作成 (認証必須) - POST /api/memos
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    // 新しいメモを作成し、認証されたユーザーIDを紐付ける
    const newMemo = new Memo({
      userId: req.user.userId,
      title,
      content,
    });
    await newMemo.save();
    res.status(201).json(newMemo);
  } catch (err) {
    console.error("メモ作成エラー:", err);
    res
      .status(500)
      .json({ message: "メモの作成中にサーバーエラーが発生しました。" });
  }
});

// 🛠️ 特定のメモを編集 (認証必須) - PUT /api/memos/:id
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { title, content, isDone } = req.body;
    // ユーザーIDとメモIDが一致するメモを検索し、更新
    const updatedMemo = await Memo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { title, content, isDone },
      { new: true } // 更新後のドキュメントを返す
    );
    if (!updatedMemo) {
      // メモが見つからない、またはユーザーに所有権がない場合
      return res
        .status(404)
        .json({
          message: "メモが見つかりません、または更新する権限がありません。",
        });
    }
    res.json(updatedMemo);
  } catch (err) {
    console.error("メモ更新エラー:", err);
    res
      .status(500)
      .json({ message: "メモの更新中にサーバーエラーが発生しました。" });
  }
});

// 🗑️ 特定のメモを削除 (認証必須) - DELETE /api/memos/:id
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    // ユーザーIDとメモIDが一致するメモを検索し、削除
    const deletedMemo = await Memo.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!deletedMemo) {
      // メモが見つからない、またはユーザーに所有権がない場合
      return res
        .status(404)
        .json({
          message: "メモが見つかりません、または削除する権限がありません。",
        });
    }
    res.json({ message: "メモを削除しました。" });
  } catch (err) {
    console.error("メモ削除エラー:", err);
    res
      .status(500)
      .json({ message: "メモの削除中にサーバーエラーが発生しました。" });
  }
});

module.exports = router;
