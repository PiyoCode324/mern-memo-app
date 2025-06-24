// client/src/components/MemoSortSelect.jsx
import React from "react";

// メモの並び順を選択するコンポーネント
const MemoSortSelect = ({ sortOrder, setSortOrder }) => {
  return (
    <div className="mb-4 flex justify-end">
      {/* 並び替えセレクトボックス */}
      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="newest">新しい順</option>
        <option value="oldest">古い順</option>
      </select>
    </div>
  );
};

export default MemoSortSelect;
