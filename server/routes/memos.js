// server/routes/memos.js

const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const Memo = require("../models/Memo");

const router = express.Router();

// 🔍 メモ一覧取得（認証必須）
router.get("/", verifyToken, async (req, res) => {
  try {
    const memos = await Memo.find({ userId: req.user.userId });
    res.json({ memos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "メモ取得エラー" });
  }
});

// ✏️ メモ新規作成（認証必須）
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    const newMemo = new Memo({
      userId: req.user.userId,
      title,
      content,
    });
    await newMemo.save();
    res.status(201).json(newMemo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "メモ作成エラー" });
  }
});

// 🛠️ メモ編集（認証必須）
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { title, content, isDone } = req.body;
    const updatedMemo = await Memo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { title, content, isDone },
      { new: true }
    );
    if (!updatedMemo) {
      return res.status(404).json({ message: "メモが見つかりません" });
    }
    res.json(updatedMemo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "メモ更新エラー" });
  }
});

// 🗑️ メモ削除（認証必須）
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deletedMemo = await Memo.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!deletedMemo) {
      return res.status(404).json({ message: "メモが見つかりません" });
    }
    res.json({ message: "メモを削除しました" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "メモ削除エラー" });
  }
});

module.exports = router;
