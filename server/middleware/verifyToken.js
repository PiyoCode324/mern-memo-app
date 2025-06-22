const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Authorizationヘッダーから "Bearer トークン" を取得
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer TOKEN" のTOKEN部分を抽出

  if (!token) {
    // トークンがない場合は認証エラー
    return res.status(401).json({ message: "認証トークンがありません。" });
  }

  try {
    // JWTトークンを検証
    const secretKey = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secretKey);
    // 検証済みユーザー情報をreq.userに格納し、次のミドルウェアまたはルートハンドラに渡す
    req.user = decoded;
    console.log("Decoded JWT payload:", decoded); // デバッグ用
    next(); // 次の処理へ
  } catch (err) {
    // トークンが無効な場合は認証失敗
    return res.status(403).json({ message: "無効なトークンです。" });
  }
};

module.exports = verifyToken;
