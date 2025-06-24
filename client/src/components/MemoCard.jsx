// client/src/components/MemoCard.jsx
import React from "react";

// A card display component for one note
const MemoCard = ({
  memo,
  editingMemoId,
  editedTitle,
  editedContent,
  setEditedTitle,
  setEditedContent,
  loading,
  startEditing,
  handleUpdate,
  setEditingMemoId,
  confirmDelete,
  handleToggleDone,
  handleTogglePin, // ✅ これを追加
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      {editingMemoId === memo._id ? (
        // Edit Mode UI
        <div>
          <input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md"
            placeholder="タイトル"
          />
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md h-24 resize-y"
            placeholder="内容"
          />
          <div className="flex gap-3">
            <button
              onClick={() => handleUpdate(memo._id)}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
              disabled={loading} // Disable the button during the update process
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
        // View Mode UI
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
            {/* Edit button */}
            <button
              onClick={() => startEditing(memo)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm"
            >
              編集
            </button>
            {/* Delete button */}
            <button
              onClick={() => confirmDelete(memo._id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
            >
              削除
            </button>
            {/* Completed/Incomplete toggle button */}
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
            {/* ピン留めボタン */}
            <button
              onClick={() => handleTogglePin(memo)}
              className={`text-yellow-500 font-bold transition-opacity duration-200 ${
                memo.isPinned ? "opacity-100" : "opacity-40 hover:opacity-70"
              }`}
            >
              📌
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoCard;
