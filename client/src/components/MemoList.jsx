// client/src/components/MemoList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMemos, createMemo, updateMemo, deleteMemo } from "../api";
import { Toaster, toast } from "react-hot-toast";
import MemoForm from "./MemoForm";
import MemoCard from "./MemoCard";
import DeleteModal from "./DeleteModal";
import MemoSortSelect from "./MemoSortSelect";

const MemoList = () => {
  const navigate = useNavigate();
  const [memos, setMemos] = useState([]);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editingMemoId, setEditingMemoId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMemoId, setSelectedMemoId] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest");

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

  // 新規作成処理
  const handleCreate = async (title, content) => {
    if (!token) {
      setError("ログインが必要です。");
      toast.error("ログインが必要です。");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await createMemo(token, { title, content });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "メモ作成に失敗しました。");
      }

      const createdMemo = await response.json();
      setMemos((prev) => [...prev, createdMemo]);
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
      toast.error("ログインが必要です。");
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
      toast.error(err.message || "メモ削除エラーが発生しました。");
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
      toast.error("ログインが必要です。");
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
      toast.error(err.message || "メモ更新エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDone = async (memo) => {
    if (!token) {
      setError("ログインが必要です。");
      toast.error("ログインが必要です。");
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
      toast.error(err.message || "完了状態の切り替えエラーが発生しました。");
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

      <MemoSortSelect sortOrder={sortOrder} setSortOrder={setSortOrder} />

      {loading && (
        <p className="text-blue-600 text-center mb-4">読み込み中...</p>
      )}
      {error && (
        <p className="text-red-500 text-center mb-4 font-medium">
          エラー: {error}
        </p>
      )}

      {/* 作成フォーム */}
      <MemoForm token={token} loading={loading} onCreate={handleCreate} />

      {memos.length === 0 && !loading && !error && token && (
        <p className="text-gray-600 text-center text-lg mt-8">
          メモがありません。新しいメモを作成しましょう！
        </p>
      )}

      {/* メモカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memos.map((memo) => (
          <MemoCard
            key={memo._id}
            memo={memo}
            editingMemoId={editingMemoId}
            editedTitle={editedTitle}
            editedContent={editedContent}
            setEditedTitle={setEditedTitle}
            setEditedContent={setEditedContent}
            setEditingMemoId={setEditingMemoId} // ✅ ← これを追加
            startEditing={startEditing}
            handleUpdate={handleUpdate}
            confirmDelete={confirmDelete}
            handleToggleDone={handleToggleDone}
            loading={loading}
          />
        ))}
      </div>

      {/* 削除モーダル */}
      <DeleteModal
        isOpen={showDeleteModal}
        onConfirm={handleDeleteConfirmed}
        onCancel={handleCancelDelete}
      />

      <Toaster position="top-center" />
    </div>
  );
};

export default MemoList;
