// server/routes/memos.js
const express = require("express");
const router = express.Router();
const Memo = require("../models/Memo"); // モデルを読み込みます

// POST /api/memos
router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;
    const newMemo = new Memo({ title, content });
    const savedMemo = await newMemo.save();
    res.status(201).json({
      message: "保存成功！",
      memo: savedMemo,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "保存に失敗しました" });
  }
});

// ✅ GET /api/memos
router.get("/", async (req, res) => {
  try {
    const memos = await Memo.find().sort({ createdAt: -1 });
    res.json({ memos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "メモの取得に失敗しました" });
  }
});

// PATCH /api/memos/:id
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const updatedMemo = await Memo.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );

    if (!updatedMemo) {
      return res.status(404).json({ message: "メモが見つかりません" });
    }

    res.json(updatedMemo);
  } catch (error) {
    console.error("メモ更新エラー:", error);
    res.status(500).json({ message: "更新に失敗しました" });
  }
});

// DELETE /api/memos/:id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.log("DELETE /api/memos/:id called with id:", id); // ←ここを追加

  try {
    const deletedMemo = await Memo.findByIdAndDelete(id);

    if (!deletedMemo) {
      return res.status(404).json({ message: "メモが見つかりません" });
    }

    res.json({ message: "メモを削除しました", memo: deletedMemo });
  } catch (error) {
    console.error("メモ削除エラー:", error);
    res.status(500).json({ message: "削除に失敗しました" });
  }
});

module.exports = router;
