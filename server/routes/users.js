const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const User = require("../models/User");

const router = express.Router();

// GET /api/users/profile - Retrieve profile information of the authenticated user
router.get("/profile", verifyToken, async (req, res) => {
  try {
    // Extract user ID from the verified JWT token
    const userId = req.user.userId;

    // Fetch user information excluding sensitive fields such as password
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "ユーザーが見つかりません。" });
    }

    // Count the total number of memos linked to the user
    const memoCount = await require("../models/Memo").countDocuments({
      userId,
    });

    // Respond with user profile data
    res.json({
      email: user.email,
      createdAt: user.createdAt,
      memoCount,
    });
  } catch (err) {
    console.error("プロフィール取得エラー:", err);
    res.status(500).json({ message: "プロフィールの取得に失敗しました。" });
  }
});

module.exports = router;
