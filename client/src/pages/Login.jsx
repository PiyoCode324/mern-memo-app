import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";

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
      const response = await login(email, password);
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", data.email);
        navigate("/");
      } else {
        setError(data.message || "ログインに失敗しました。");
      }
    } catch (err) {
      setError("ネットワークエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md transition-colors duration-300">
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
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                       focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors duration-300"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors duration-300"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md 
                       transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "ログイン中..." : "Log In"}
          </button>
        </form>
        <div className="text-sm text-center text-gray-600 dark:text-gray-300 mt-4 transition-colors duration-300">
          <p>
            Don't have an account?{" "}
            <a href="/signup" className="text-indigo-600 hover:underline">
              Sign Up
            </a>
          </p>
          <p className="mt-2">
            パスワードを忘れましたか？{" "}
            <a
              href="/password-reset-request"
              className="text-indigo-600 hover:underline"
            >
              パスワードをリセットする
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
