import React, { useState } from "react";
import { toast } from "react-hot-toast";

const MemoForm = ({ token, loading, onCreate }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const handleSubmit = async () => {
    if (!token) {
      toast.error("ログインが必要です。");
      return;
    }
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error("タイトルと内容を入力してください。", {
        duration: 2000,
        icon: "⚠️",
      });
      return;
    }
    await onCreate(newTitle, newContent);
    setNewTitle("");
    setNewContent("");
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-100 mb-4">
        📌 新しいメモを作成
      </h3>
      <input
        type="text"
        placeholder="タイトル"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        disabled={!token || loading}
        className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-md
                   focus:outline-none focus:ring-2 focus:ring-indigo-500
                   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-100"
      />
      <textarea
        placeholder="内容"
        value={newContent}
        onChange={(e) => setNewContent(e.target.value)}
        disabled={!token || loading}
        className="w-full px-4 py-2 mb-4 h-32 resize-y border border-gray-300 rounded-md
                   focus:outline-none focus:ring-2 focus:ring-indigo-500
                   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-100"
      />
      <button
        onClick={handleSubmit}
        disabled={!token || loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg
                   disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
      >
        作成
      </button>
    </div>
  );
};

export default MemoForm;
