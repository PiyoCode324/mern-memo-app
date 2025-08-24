// src/hooks/useMemoListLogic.js

// Custom hook: Responsible for obtaining the list of memos and managing their status
import { useCallback, useEffect, useState } from "react";
import { fetchMemos } from "../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export const useMemoListLogic = (token, page, limit) => {
  // Memo list data
  const [memos, setMemos] = useState([]);

  // Total number of memos (used for pagination)
  const [total, setTotal] = useState(0);

  // Error Message
  const [error, setError] = useState(null);

  // Loading state (loading while true)
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /**
   * Function to get a list of memos from the API
   * - Redirect to login screen if authentication error occurs
   * - On success: Save memos and count
   * - On failure: Set error in state and toast
   */
  const loadMemos = useCallback(async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetchMemos(token, page, limit);

      // In case of authentication error, go to login screen
      // if (response.status === 401 || response.status === 403) {
      //   localStorage.removeItem("token");
      //   navigate("/login");
      //   throw new Error("認証エラー: 再度ログインしてください。");
      // }

      // Other HTTP error handling
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // If successful: Set the list of memos and the number of memos
      const data = await response.json();
      setMemos(data.memos);
      setTotal(data.total);
    } catch (err) {
      console.error("メモ取得エラー:", err);
      setError(err.message || "メモの取得に失敗しました。");
      setMemos([]);
      toast.error(err.message || "メモの取得に失敗しました。");
    } finally {
      setLoading(false);
    }
  }, [token, navigate, page, limit]);

  /**
   * Fetch memos on initial render and when dependencies (e.g. page, token) change
   */
  useEffect(() => {
    loadMemos();
  }, [loadMemos]);

  // State/function to be returned to the outside
  return {
    memos,
    total,
    error,
    loading,
    loadMemos,
    setMemos,
    setTotal,
    setError,
    setLoading,
  };
};
