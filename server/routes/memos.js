const express = require("express");
const verifyToken = require("../middleware/verifyToken"); // JWT認証ミドルウェアをインポート
const Memo = require("../models/Memo"); // Memoモデルをインポート

const router = express.Router();

// GET /api/memos?page=1&limit=10 - メモ一覧を取得 (isDeletedがfalseのものを取得)
router.get("/", verifyToken, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const memos = await Memo.find({ userId: req.user.userId, isDeleted: false })
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Memo.countDocuments({
      userId: req.user.userId,
      isDeleted: false,
    });

    res.json({ memos, total });
  } catch (err) {
    console.error("メモ取得エラー:", err);
    res.status(500).json({ message: "メモの取得に失敗しました。" });
  }
});

// POST /api/memos - 新しいメモを作成 (認証が必要)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, content, category } = req.body; // categoryを追加
    // バリデーション
    if (!title || !content) {
      return res.status(400).json({ message: "タイトルと内容は必須です。" });
    }

    // 新しいメモを作成し、認証済みユーザーIDと紐付ける
    const newMemo = new Memo({
      userId: req.user.userId,
      title,
      content,
      category: category || "", // categoryを保存
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

// =====================================================================
// IMPORTANT: ルーティングの順序を修正しました
// より具体的なパス (例: /trash) は、動的なIDを持つパス (例: /:id) よりも前に定義する必要があります。
// =====================================================================

// GET /api/memos/trash - ゴミ箱のメモ一覧を取得 (認証が必要)
// このルートは /api/memos/:id よりも前に定義されています
router.get("/trash", verifyToken, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const trashedMemos = await Memo.find({
      userId: req.user.userId,
      isDeleted: true, // isDeletedがtrueのメモのみを取得
    })
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Memo.countDocuments({
      userId: req.user.userId,
      isDeleted: true,
    });

    res.status(200).json({ memos: trashedMemos, total });
  } catch (err) {
    console.error("ゴミ箱メモ取得エラー:", err);
    res.status(500).json({ message: "ゴミ箱の取得に失敗しました。" });
  }
});

// DELETE /api/memos/trash - ゴミ箱を空にする (isDeletedがtrueのメモをすべて物理削除)
// このルートも /api/memos/:id よりも前に定義されています
router.delete("/trash", verifyToken, async (req, res) => {
  try {
    const result = await Memo.deleteMany({
      userId: req.user.userId,
      isDeleted: true, // isDeletedがtrueのメモのみを削除
    });

    res.json({
      message: `ゴミ箱を空にしました（${result.deletedCount} 件削除）。`,
    });
  } catch (err) {
    console.error("ゴミ箱完全削除エラー:", err);
    res.status(500).json({ message: "ゴミ箱の完全削除に失敗しました。" });
  }
});

// GET /api/memos/:id - 特定のメモを取得 (認証が必要)
// このルートは /trash よりも後に定義されています
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

// PUT /api/memos/:id - 特定のメモを編集 (認証が必要)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { title, content, category, isDone, isPinned } = req.body; // categoryを追加

    const updatedMemo = await Memo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { title, content, category, isDone, isPinned }, // isPinnedも含むように更新
      { new: true }
    );

    // バリデーション
    if (
      title === undefined &&
      content === undefined &&
      category === undefined &&
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

// DELETE /api/memos/:id - 特定のメモを削除 (ゴミ箱へ移動、認証が必要)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    // ユーザーIDとメモIDが一致するメモを検索し、isDeletedをtrueに設定（論理削除）
    const deletedMemo = await Memo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { isDeleted: true }, // ここでisDeletedをtrueに設定
      { new: true }
    );
    if (!deletedMemo) {
      // メモが見つからないか、ユーザーが所有していない場合
      return res.status(404).json({
        message: "メモが見つかりません、または削除する権限がありません。",
      });
    }
    res.json({ message: "メモをゴミ箱に移動しました。" }); // メッセージを明確に
  } catch (err) {
    console.error("メモ削除エラー:", err);
    res
      .status(500)
      .json({ message: "メモの削除中にサーバーエラーが発生しました。" });
  }
});

// PUT /api/memos/:id/restore - ゴミ箱からメモを復元 (認証が必要)
router.put("/:id/restore", verifyToken, async (req, res) => {
  try {
    const restoredMemo = await Memo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { isDeleted: false }, // isDeletedをfalseに戻す
      { new: true }
    );

    if (!restoredMemo) {
      return res.status(404).json({ message: "メモが見つかりません。" });
    }

    res.json(restoredMemo);
  } catch (err) {
    res.status(500).json({ message: "メモの復元に失敗しました。" });
  }
});

module.exports = router;
