import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { passwordReset } from "../api"; // api.jsに追加予定

const PasswordReset = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setError("パスワードが一致しません。");
      return;
    }

    setLoading(true);

    try {
      const res = await passwordReset(token, newPassword);
      if (res.ok) {
        setMessage("パスワードがリセットされました。ログインしてください。");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        const data = await res.json();
        setError(data.message || "リセットに失敗しました。");
      }
    } catch (err) {
      setError("ネットワークエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <p className="text-center mt-20 text-red-600">
        無効なURLです。パスワードリセットリンクを確認してください。
      </p>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">新しいパスワードを設定</h2>
      {message && <p className="text-green-600 mb-4">{message}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="新しいパスワード"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full mb-4 px-4 py-2 border rounded"
          disabled={loading}
        />
        <input
          type="password"
          placeholder="パスワード確認"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full mb-4 px-4 py-2 border rounded"
          disabled={loading}
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "送信中..." : "パスワードをリセットする"}
        </button>
      </form>
    </div>
  );
};

export default PasswordReset;
