import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMemo } from "../api";
import MemoDetail from "../components/MemoDetail";

const MemoDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [memo, setMemo] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token"); // トークン取得

  useEffect(() => {
    const getMemo = async () => {
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const res = await fetchMemo(token, id); // tokenとidを渡す
        if (!res.ok) {
          throw new Error("メモの取得に失敗しました");
        }
        const data = await res.json(); // JSONを取得
        setMemo(data);
      } catch (err) {
        setError(err.message || "メモの取得に失敗しました。");
        setTimeout(() => navigate("/"), 2000);
      }
    };
    getMemo();
  }, [id, navigate, token]);

  if (error) {
    return (
      <div className="text-red-500 text-center mt-6 bg-white dark:bg-gray-900 p-4 rounded-md">
        <p>{error}</p>
        <p>2秒後にメモ一覧へ戻ります...</p>
      </div>
    );
  }

  if (!memo) {
    return (
      <p className="text-center mt-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 rounded-md">
        読み込み中...
      </p>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 rounded-md shadow-md">
      <MemoDetail memo={memo} />
      <div className="text-center mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => navigate("/")}
        >
          メモ一覧に戻る
        </button>
      </div>
    </div>
  );
};

export default MemoDetailPage;
