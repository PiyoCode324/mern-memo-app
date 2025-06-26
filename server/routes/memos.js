// server/routes/memos.js

const express = require("express");
const verifyToken = require("../middleware/verifyToken"); // Import the JWT authentication middleware
const Memo = require("../models/Memo"); // Import Memo model

const router = express.Router();

// 🔍 Get all notes (requires authentication) - GET /api/memos
router.get("/", verifyToken, async (req, res) => {
  try {
    // Get only notes associated with the logged-in user ID
    const memos = await Memo.find({ userId: req.user.userId });
    res.json({ memos });
  } catch (err) {
    console.error("メモ取得エラー:", err);
    res
      .status(500)
      .json({ message: "メモの取得中にサーバーエラーが発生しました。" });
  }
});

// ✏️ Create a new note (requires authentication) - POST /api/memos
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;

    // Adding validation
    if (!title || !content) {
      return res.status(400).json({ message: "タイトルと内容は必須です。" });
    }

    // Create a new note and associate it with the authenticated user ID
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

// 🛠️ Edit a specific note (requires authentication) - PUT /api/memos/:id
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { title, content, isDone, isPinned } = req.body; // ← Added isPinned!

    const updatedMemo = await Memo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { title, content, isDone, isPinned }, // ← Updated to include isPinned
      { new: true }
    );

    // Adding validation
    if (
      title === undefined &&
      content === undefined &&
      isDone === undefined &&
      isPinned === undefined
    ) {
      return res.status(400).json({
        message: "更新内容が指定されていません。",
      });
    }

    if (!updatedMemo) {
      return res.status(404).json({
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

// 🗑️ Delete a specific note (requires authentication) - DELETE /api/memos/:id
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    // Search for and delete notes with matching user ID and note ID
    const deletedMemo = await Memo.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!deletedMemo) {
      // Notes are missing or the user does not own them
      return res.status(404).json({
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

// 🔍 Get a specific note (requires authentication) - GET /api/memos/:id
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const memo = await Memo.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!memo) {
      return res.status(404).json({
        message: "メモが見つかりません、または閲覧する権限がありません。",
      });
    }

    res.json(memo);
  } catch (err) {
    console.error("メモ取得エラー:", err);
    res
      .status(500)
      .json({ message: "メモの取得中にサーバーエラーが発生しました。" });
  }
});

module.exports = router;
