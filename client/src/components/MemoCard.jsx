import React, { useState } from "react";
import { Link } from "react-router-dom";

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
  handleTogglePin,
  editedCategory,
  setEditedCategory,
}) => {
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  // PDFプレビューモーダルを開く
  const openPdfModal = (url) => {
    setPdfUrl(url);
    setShowPdfModal(true);
  };

  // PDFプレビューモーダルを閉じる
  const closePdfModal = () => {
    setShowPdfModal(false);
    setPdfUrl("");
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      {editingMemoId === memo._id ? (
        <div>
          <input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="タイトル"
            className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md
                       dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            placeholder="内容"
            className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md h-24 resize-y
                       dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />

          <select
            value={editedCategory}
            onChange={(e) => setEditedCategory(e.target.value)}
            className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md
             dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          >
            <option value="">カテゴリを選択</option>
            <option value="仕事">仕事</option>
            <option value="日記">日記</option>
            <option value="買い物">買い物</option>
            <option value="アイデア">アイデア</option>
            <option value="その他">その他</option>
          </select>

          {/* ※ ファイル編集は別途対応が必要です */}

          <div className="flex gap-3">
            <button
              onClick={() => handleUpdate(memo._id)}
              disabled={loading}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
            >
              保存
            </button>
            <button
              onClick={() => setEditingMemoId(null)}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg
                         transition-colors duration-300"
            >
              キャンセル
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h3
            className={`text-xl font-bold mb-2 ${
              memo.isDone
                ? "line-through text-gray-500 dark:text-gray-400"
                : "text-gray-900 dark:text-gray-100"
            }`}
          >
            <Link
              to={`/memo/${memo._id}`}
              className="hover:underline text-blue-600 dark:text-blue-400 block"
            >
              {memo.title}
            </Link>
          </h3>

          {/* カテゴリ表示 */}
          {memo.category && (
            <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-2">
              カテゴリ: {memo.category}
            </p>
          )}

          <p className="text-gray-700 dark:text-gray-300 mb-3">
            {memo.content}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            完了: {memo.isDone ? "✅" : "❌"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
            作成日: {new Date(memo.createdAt).toLocaleString()}
          </p>

          {/* 添付ファイル一覧表示 */}
          {memo.attachments && memo.attachments.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">
                添付ファイル
              </h4>
              <div className="flex flex-wrap gap-3">
                {memo.attachments.map((file, index) => (
                  <div key={index} className="relative">
                    {file.type.startsWith("image/") ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-20 h-20 object-cover rounded cursor-pointer border border-gray-300"
                        onClick={() => window.open(file.url, "_blank")}
                      />
                    ) : file.type === "application/pdf" ? (
                      <button
                        onClick={() => openPdfModal(file.url)}
                        className="w-20 h-20 flex items-center justify-center bg-gray-300 rounded cursor-pointer text-sm
                                   border border-gray-300 dark:bg-gray-700 dark:text-gray-300"
                      >
                        PDF
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 操作ボタン群 */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => startEditing(memo)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm
                         transition-colors duration-300"
            >
              編集
            </button>
            <button
              onClick={() => confirmDelete(memo._id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm
                         transition-colors duration-300"
            >
              削除
            </button>
            <button
              onClick={() => handleToggleDone(memo)}
              className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors duration-300 ${
                memo.isDone
                  ? "bg-yellow-500 hover:bg-yellow-600 text-gray-800"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {memo.isDone ? "未完了にする" : "完了にする"}
            </button>
            <button
              onClick={() => handleTogglePin(memo)}
              className={`text-yellow-500 font-bold transition-opacity duration-200 ${
                memo.isPinned ? "opacity-100" : "opacity-40 hover:opacity-70"
              }`}
              aria-label={memo.isPinned ? "ピン留め解除" : "ピン留め"}
            >
              📌
            </button>
          </div>
        </div>
      )}

      {/* PDFプレビューモーダル */}
      {showPdfModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={closePdfModal}
        >
          <iframe
            src={pdfUrl}
            title="PDF Preview"
            className="w-11/12 h-5/6 bg-white rounded shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

export default MemoCard;
