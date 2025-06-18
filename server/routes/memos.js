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
      memo: savedMemo
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

module.exports = router;
