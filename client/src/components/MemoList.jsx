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
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");

  const sortMemos = (memosToSort, order) => {
    let sorted = [...memosToSort];

    sorted.sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }
      if (a.isDone !== b.isDone) {
        return a.isDone ? 1 : -1;
      }
      if (order === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (order === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return 0;
    });

    return sorted;
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
        setMemos(data.memos);
      } catch (err) {
        console.error("メモ取得エラー:", err);
        setError(err.message || "メモの取得に失敗しました。");
        setMemos([]);
      } finally {
        setLoading(false);
      }
    };

    getMemos();
  }, [token, navigate]);

  useEffect(() => {
    setMemos((prevMemos) => sortMemos(prevMemos, sortOrder));
  }, [sortOrder]);

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
      setMemos((prev) => sortMemos([...prev, createdMemo], sortOrder));
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

      setMemos(
        sortMemos(
          memos.filter((memo) => memo._id !== id),
          sortOrder
        )
      );
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

  const filteredMemos = memos.filter(
    (memo) =>
      memo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memo.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTogglePin = async (memo) => {
    if (!token) {
      toast.error("ログインが必要です。");
      return;
    }
    setLoading(true);
    try {
      const response = await updateMemo(token, memo._id, {
        isPinned: !memo.isPinned,
      });
      if (!response.ok) {
        throw new Error("ピン状態の更新に失敗しました。");
      }
      const updatedMemo = await response.json();

      const updatedMemos = memos.map((m) =>
        m._id === updatedMemo._id ? updatedMemo : m
      );

      setMemos(sortMemos(updatedMemos, sortOrder));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 text-center flex-grow">
          📝 メモ一覧
        </h2>
        {token && (
          <div className="flex space-x-2">
            <button
              onClick={() => navigate("/profile")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
            >
              プロフィール
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
            >
              ログアウト
            </button>
          </div>
        )}
      </div>

      <MemoSortSelect sortOrder={sortOrder} setSortOrder={setSortOrder} />

      <div className="mb-6">
        <input
          type="text"
          placeholder="タイトルまたは内容で検索"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-100"
        />
      </div>

      {loading && (
        <p className="text-blue-600 dark:text-blue-400 text-center mb-4">
          読み込み中...
        </p>
      )}
      {error && (
        <p className="text-red-500 text-center mb-4 font-medium">{`エラー: ${error}`}</p>
      )}

      <MemoForm token={token} loading={loading} onCreate={handleCreate} />

      {memos.length === 0 && !loading && !error && token && (
        <p className="text-gray-600 dark:text-gray-400 text-center text-lg mt-8">
          メモがありません。新しいメモを作成しましょう！
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortMemos(filteredMemos, sortOrder).map((memo) => (
          <MemoCard
            key={memo._id}
            memo={memo}
            editingMemoId={editingMemoId}
            editedTitle={editedTitle}
            editedContent={editedContent}
            setEditedTitle={setEditedTitle}
            setEditedContent={setEditedContent}
            setEditingMemoId={setEditingMemoId}
            startEditing={startEditing}
            handleUpdate={handleUpdate}
            confirmDelete={confirmDelete}
            handleToggleDone={handleToggleDone}
            handleTogglePin={handleTogglePin}
            loading={loading}
          />
        ))}
      </div>

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
