import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Importing Child Components
import MemoForm from "./MemoForm";
import MemoCard from "./MemoCard";
import DeleteModal from "./DeleteModal";
import MemoSortSelect from "./MemoSortSelect";
import Pagination from "./Pagination";

// Importing custom hooks
import { useMemoListLogic } from "../hooks/useMemoListLogic";
import { useMemoActions } from "../hooks/useMemoActions";
import { useFilteredMemos } from "../hooks/useFilteredMemos";

const MemoList = () => {
  const navigate = useNavigate();

  // Status of the memo to be edited
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editingMemoId, setEditingMemoId] = useState(null);

  // Display control of deletion modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMemoId, setSelectedMemoId] = useState(null);

  // Sorting, searching, and category filtering
  const [sortOrder, setSortOrder] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  // Editing Category
  const [editedCategory, setEditedCategory] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // 1ページあたりの表示数

  // Acquire a token for the logged-in user
  const token = localStorage.getItem("token");

  // ✅ Custom hooks to manage memo retrieval and loading states
  const { memos, total, error, loading, loadMemos, setError, setLoading } =
    useMemoListLogic(token, page, limit);

  // ✅ Custom hooks to provide CRUD operations for memo etc.
  const {
    handleCreate,
    handleUpdate,
    handleDelete,
    handleToggleDone,
    handleTogglePin,
  } = useMemoActions({
    token,
    loadMemos,
    setLoading,
    setError,
    setEditingMemoId,
  });

  // ✅ Filtered, searched and sorted memo list
  const { sortedAndFilteredMemos } = useFilteredMemos(
    memos,
    searchQuery,
    filterCategory,
    sortOrder
  );

  // Processing when switching pages
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(total / limit)) {
      setPage(newPage);
    }
  };

  // Preparing to display delete confirmation modal
  const confirmDelete = (id) => {
    setSelectedMemoId(id);
    setShowDeleteModal(true);
  };

  // When the user confirms deletion in the modal, delete the memo
  const handleDeleteConfirmed = async () => {
    if (!selectedMemoId) return;
    await handleDelete(selectedMemoId);
    setShowDeleteModal(false);
    setSelectedMemoId(null);
  };

  // When canceling the delete modal
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedMemoId(null);
  };

  // Update status when editing begins
  const startEditing = (memo) => {
    setEditingMemoId(memo._id);
    setEditedTitle(memo.title);
    setEditedContent(memo.content);
    setEditedCategory(memo.category || "");
  };

  // Handles logout: removes token and navigates to login screen
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/login");
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header: Trash, Title, Profile/Logout */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate("/trash")}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          🗑 ゴミ箱
        </button>

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

      {/* Sort Selection Component */}
      <MemoSortSelect sortOrder={sortOrder} setSortOrder={setSortOrder} />

      {/* Search box */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="タイトルまたは内容で検索"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-100"
        />
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        >
          <option value="">カテゴリで絞り込み（すべて）</option>
          <option value="仕事">仕事</option>
          <option value="日記">日記</option>
          <option value="買い物">買い物</option>
          <option value="アイデア">アイデア</option>
          <option value="その他">その他</option>
        </select>
      </div>

      {/* Loading message*/}
      {loading && (
        <p className="text-blue-600 dark:text-blue-400 text-center mb-4">
          読み込み中...
        </p>
      )}

      {/* Error message display */}
      {error && (
        <p className="text-red-500 text-center mb-4 font-medium">{`エラー: ${error}`}</p>
      )}

      {/* Memo-taking form */}
      <MemoForm token={token} loading={loading} onCreate={handleCreate} />

      {/* Display when no memos exist */}
      {memos.length === 0 && !loading && !error && token && (
        <p className="text-gray-600 dark:text-gray-400 text-center text-lg mt-8">
          メモがありません。新しいメモを作成しましょう！
        </p>
      )}

      {/* Memo Card Display Area (Filtered + Sorted) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedAndFilteredMemos.map((memo) => (
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
            editedCategory={editedCategory}
            setEditedCategory={setEditedCategory}
          />
        ))}
      </div>

      {/* Delete confirmation modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onConfirm={handleDeleteConfirmed}
        onCancel={handleCancelDelete}
      />

      {/* Pagination Component */}
      <Pagination
        page={page}
        totalPages={Math.ceil(total / limit)}
        onPageChange={handlePageChange}
      />

      {/* Toast display */}
      <Toaster position="top-center" />
    </div>
  );
};

export default MemoList;
