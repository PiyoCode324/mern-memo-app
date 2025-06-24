// client/src/components/DeleteModal.jsx
import React from "react";

// Delete Confirmation Modal Component
const DeleteModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    // A semi-transparent overlay in the background and a modal in the center
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
        <h2 className="text-lg font-bold mb-4 text-gray-800">
          本当に削除しますか？
        </h2>
        <p className="text-gray-600 mb-6 text-sm">この操作は元に戻せません。</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            削除する
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
