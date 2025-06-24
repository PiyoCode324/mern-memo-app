// client/src/components/MemoForm.jsx
import React, { useState } from "react";
import { toast } from "react-hot-toast";

// New Note Form Component
const MemoForm = ({ token, loading, onCreate }) => {
  const [newTitle, setNewTitle] = useState("");
  // Title being entered
  const [newContent, setNewContent] = useState("");
  // Content being entered

  // Processing when the Create button is pressed
  const handleSubmit = async () => {
    if (!token) {
      // The error message shown when a user is not logged in.
      toast.error("ログインが必要です。");
      return;
    }
    // If the title or content is empty
    if (!newTitle.trim() || !newContent.trim()) {
      // Toast Notifications
      toast.error("タイトルと内容を入力してください。", {
        duration: 2000,
        icon: "⚠️",
      });
      return;
    }

    // Invoke the parent component's creation process
    await onCreate(newTitle, newContent);

    // Clear the input field
    setNewTitle("");
    setNewContent("");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        📌 新しいメモを作成
      </h3>
      {/* Title input */}
      <input
        type="text"
        placeholder="タイトル"
        value={newTitle}
        // Save the title
        onChange={(e) => setNewTitle(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md mb-3"
        disabled={!token || loading}
        // Cannot be entered if not logged in or processing is in progress
      />
      {/* Content input */}
      <textarea
        placeholder="内容"
        value={newContent}
        // Save content
        onChange={(e) => setNewContent(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 h-32 resize-y"
        disabled={!token || loading}
        // Cannot be entered if not logged in or processing is in progress
      />
      {/* Create button */}
      <button
        // Handle form submission when Create button is clicked
        onClick={handleSubmit}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
        disabled={!token || loading}
        // Cannot be entered if not logged in or processing is in progress
      >
        作成
      </button>
    </div>
  );
};

export default MemoForm;
