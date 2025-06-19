import React, { useEffect, useState } from "react";

const MemoList = () => {
  const [memos, setMemos] = useState([]);
  const [editingMemoId, setEditingMemoId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");

  // Fetch memos from the backend API when the component mounts
  useEffect(() => {
    fetch("/api/memos")
      .then((res) => res.json())
      .then((data) => {
        // Save fetched memos to local state
        setMemos(data.memos);
      })
      .catch((err) => {
        console.error("Failed to fetch memos:", err);
      });
  }, []);

  // Handle clicking the "Edit" button: set the current memo to be edited
  const handleEditClick = (memo) => {
    setEditingMemoId(memo._id);
    setEditedTitle(memo.title);
    setEditedContent(memo.content);
  };

  // Handle saving the edited memo
  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`/api/memos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editedTitle,
          content: editedContent,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update memo");
      }

      const updatedMemo = await res.json();

      // Update the memo in local state
      setMemos((prevMemos) =>
        prevMemos.map((memo) => (memo._id === id ? updatedMemo : memo))
      );

      // Clear editing state
      setEditingMemoId(null);
      setEditedTitle("");
      setEditedContent("");
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  // Handle deleting a memo
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this memo?")) return;

    try {
      const res = await fetch(`/api/memos/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete memo");
      }

      // Remove the deleted memo from local state
      setMemos((prevMemos) => prevMemos.filter((memo) => memo._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div>
      <h2>📝 Memo List</h2>
      <ul>
        {/* Render the list of memos */}
        {memos.map((memo) => (
          <li key={memo._id} className="border p-2 my-2">
            {editingMemoId === memo._id ? (
              // Edit mode UI
              <div>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="border p-1 w-full"
                />
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="border p-1 w-full mt-2"
                />
                <div className="mt-2">
                  <button
                    onClick={() => handleUpdate(memo._id)}
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingMemoId(null)}
                    className="bg-gray-400 text-white px-2 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // Display mode UI
              <div>
                <strong>{memo.title}</strong>: {memo.content}
                <button
                  onClick={() => handleEditClick(memo)}
                  className="ml-4 bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(memo._id)}
                  className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemoList;
