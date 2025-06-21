const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Authorizationヘッダーから "Bearer トークン" を取得
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer TOKEN" のTOKEN部分

  if (!token) {
    return res.status(401).json({ message: "認証トークンがありません。" });
  }

  try {
    // トークン検証
    const secretKey = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secretKey);
    // ユーザー情報をreq.userに格納
    req.user = decoded;
    console.log("Decoded JWT payload:", decoded);
    next(); // 次の処理へ
  } catch (err) {
    return res.status(403).json({ message: "無効なトークンです。" });
  }
};

module.exports = verifyToken;
