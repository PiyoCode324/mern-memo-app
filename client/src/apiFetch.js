// client/src/apiFetch.js
export const apiFetch = async (url, options = {}) => {
  const res = await fetch(url, options);

  // 認証エラーを検知
  if (res.status === 401 || res.status === 403) {
    console.warn("認証エラー: ログアウト処理へ");

    // トークン削除
    localStorage.removeItem("token");

    // ログインページにリダイレクト
    localStorage.removeItem("token");

    // ここで「Response風のダミー」を返す
    return new Response(JSON.stringify({ message: "認証エラー" }), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  return res;
};
