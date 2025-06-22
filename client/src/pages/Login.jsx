// client/src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api"; // api.jsからlogin関数をインポート

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // api.jsからインポートしたlogin関数を使用
      const response = await login(email, password);
      const data = await response.json(); // レスポンスボディをJSONとしてパース

      if (response.ok) {
        console.log("Login successful:", data);
        localStorage.setItem("token", data.token); // ログイン成功時にトークンを保存
        localStorage.setItem("email", data.email); // 必要であればユーザーのメールアドレスも保存
        navigate("/"); // ログイン成功したらメモ一覧ページへ遷移
      } else {
        // エラーレスポンスの場合
        console.error("Login failed:", data);
        setError(data.message || "ログインに失敗しました。");
      }
    } catch (err) {
      // ネットワークエラーなど
      console.error("Network error during login:", err);
      setError("ネットワークエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          Log In
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-center">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "ログイン中..." : "Log In"}
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-indigo-600 hover:underline">
            Sign Up
          </a>
          <p className="text-sm text-center text-gray-600 mt-4">
            パスワードを忘れましたか？{" "}
            <a
              href="/password-reset-request"
              className="text-indigo-600 hover:underline"
            >
              パスワードをリセットする
            </a>
          </p>
        </p>
      </div>
    </div>
  );
};

export default Login;
