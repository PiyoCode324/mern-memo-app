import React, { useState } from "react";
import { passwordResetRequest } from "../api"; // api.jsに追加予定
// もしAPI関数をまだ作っていなければ作成します。

const PasswordResetRequest = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const res = await passwordResetRequest(email);
      if (res.ok) {
        setMessage("パスワードリセット用のリンクを送信しました。メールをご確認ください。");
      } else {
        const data = await res.json();
        setError(data.message || "エラーが発生しました。");
      }
    } catch (err) {
      setError("ネットワークエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">パスワードリセット</h2>
      {message && <p className="text-green-600 mb-4">{message}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 px-4 py-2 border rounded"
          disabled={loading}
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "送信中..." : "リセットリンクを送る"}
        </button>
      </form>
    </div>
  );
};

export default PasswordResetRequest;
