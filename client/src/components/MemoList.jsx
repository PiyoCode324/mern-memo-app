// client/src/components/MemoList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMemos, createMemo, updateMemo, deleteMemo } from "../api";
import { Toaster, toast } from "react-hot-toast";

const MemoList = () => {
  const navigate = useNavigate();
  const [memos, setMemos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editingMemoId, setEditingMemoId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMemoId, setSelectedMemoId] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest"); // 追加: 並び順

  const token = localStorage.getItem("token");

  // 並び替え関数
  const sortMemos = (memos, order) => {
    return [...memos].sort((a, b) =>
      order === "newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError(null);

    const getMemos = async () => {
      try {
        const response = await fetchMemos(token);

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
          throw new Error("認証エラー: 再度ログインしてください。");
        }
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setMemos(sortMemos(data.memos, sortOrder));
      } catch (err) {
        console.error("メモ取得エラー:", err);
        setError(err.message || "メモの取得に失敗しました。");
        setMemos([]);
      } finally {
        setLoading(false);
      }
    };

    getMemos();
  }, [token, navigate, sortOrder]);

  const handleCreate = async () => {
    if (!token) {
      setError("ログインが必要です。");
      return;
    }

    // ✅ ここにバリデーションを追加！
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error("タイトルと内容を入力してください。");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await createMemo(token, {
        title: newTitle,
        content: newContent,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "メモ作成に失敗しました。");
      }

      const createdMemo = await response.json();
      setMemos([...memos, createdMemo]);
      setNewTitle("");
      setNewContent("");
      toast.success("メモを作成しました！");
    } catch (err) {
      console.error("メモ作成エラー:", err);
      setError(err.message || "メモ作成エラーが発生しました。");
      toast.error(err.message || "メモ作成エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id) => {
    setSelectedMemoId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!selectedMemoId) return;
    await handleDelete(selectedMemoId);
    setShowDeleteModal(false);
    setSelectedMemoId(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedMemoId(null);
  };

  const handleDelete = async (id) => {
    if (!token) {
      setError("ログインが必要です。");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await deleteMemo(token, id);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "メモ削除に失敗しました。");
      }

      setMemos(memos.filter((memo) => memo._id !== id));
    } catch (err) {
      console.error("削除エラー:", err);
      setError(err.message || "メモ削除エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (memo) => {
    setEditingMemoId(memo._id);
    setEditedTitle(memo.title);
    setEditedContent(memo.content);
  };

  const handleUpdate = async (id) => {
    if (!token) {
      setError("ログインが必要です。");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await updateMemo(token, id, {
        title: editedTitle,
        content: editedContent,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "メモ更新に失敗しました。");
      }

      const updatedMemo = await response.json();
      const updatedMemos = memos.map((memo) =>
        memo._id === id ? updatedMemo : memo
      );
      setMemos(sortMemos(updatedMemos, sortOrder));
      setEditingMemoId(null);
    } catch (err) {
      console.error("更新エラー:", err);
      setError(err.message || "メモ更新エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDone = async (memo) => {
    if (!token) {
      setError("ログインが必要です。");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await updateMemo(token, memo._id, {
        title: memo.title,
        content: memo.content,
        isDone: !memo.isDone,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "完了状態の切り替えに失敗しました。"
        );
      }

      const updatedMemo = await response.json();
      const updatedMemos = memos.map((m) =>
        m._id === memo._id ? updatedMemo : m
      );
      setMemos(sortMemos(updatedMemos, sortOrder));
    } catch (err) {
      console.error("完了状態の切り替えエラー:", err);
      setError(err.message || "完了状態の切り替えエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/login");
  };

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center flex-grow">
          📝 メモ一覧
        </h2>
        {token && (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
          >
            ログアウト
          </button>
        )}
      </div>

      <div className="mb-4 flex justify-end">
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="newest">新しい順</option>
          <option value="oldest">古い順</option>
        </select>
      </div>

      {loading && (
        <p className="text-blue-600 text-center mb-4">読み込み中...</p>
      )}
      {error && (
        <p className="text-red-500 text-center mb-4 font-medium">
          エラー: {error}
        </p>
      )}

      {/* 作成フォーム */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          📌 新しいメモを作成
        </h3>
        <input
          type="text"
          placeholder="タイトル"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md mb-3"
          disabled={!token || loading}
        />
        <textarea
          placeholder="内容"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 h-32 resize-y"
          disabled={!token || loading}
        />
        <button
          onClick={handleCreate}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
          disabled={!token || loading}
        >
          作成
        </button>
      </div>

      {memos.length === 0 && !loading && !error && token && (
        <p className="text-gray-600 text-center text-lg mt-8">
          メモがありません。新しいメモを作成しましょう！
        </p>
      )}

      {/* メモカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memos.map((memo) => (
          <div
            key={memo._id}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
          >
            {editingMemoId === memo._id ? (
              <div>
                <input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md"
                />
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md h-24 resize-y"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => handleUpdate(memo._id)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
                    disabled={loading}
                  >
                    保存
                  </button>
                  <button
                    onClick={() => setEditingMemoId(null)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3
                  className={`text-xl font-bold mb-2 ${
                    memo.isDone ? "line-through text-gray-500" : ""
                  }`}
                >
                  {memo.title}
                </h3>
                <p className="text-gray-700 mb-3">{memo.content}</p>
                <p className="text-sm text-gray-600 mb-1">
                  完了: {memo.isDone ? "✅" : "❌"}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  作成日: {new Date(memo.createdAt).toLocaleString()}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => startEditing(memo)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => confirmDelete(memo._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
                  >
                    削除
                  </button>
                  <button
                    onClick={() => handleToggleDone(memo)}
                    className={`px-3 py-2 rounded-lg text-sm font-bold ${
                      memo.isDone
                        ? "bg-yellow-500 hover:bg-yellow-600 text-gray-800"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                  >
                    {memo.isDone ? "未完了にする" : "完了にする"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 削除モーダル */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              本当に削除しますか？
            </h2>
            <p className="text-gray-600 mb-6 text-sm">
              この操作は元に戻せません。
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeleteConfirmed}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                削除する
              </button>
              <button
                onClick={handleCancelDelete}
                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
      <Toaster position="top-center" />
    </div>
  );
};

export default MemoList;
