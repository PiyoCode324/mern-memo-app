import React, { useEffect, useState } from "react";

const MemoList = () => {
  // A state that manages a list of notes
  const [memos, setMemos] = useState([]);
  // Manage the ID of the memo being edited
  const [editingMemoId, setEditingMemoId] = useState(null);
  // Manage titles being edited
  const [editedTitle, setEditedTitle] = useState("");
  // Manage your edits
  const [editedContent, setEditedContent] = useState("");
  // Manage search keywords
  const [searchTerm, setSearchTerm] = useState("");

  // Retrieve the notes from the API when the component first renders
  useEffect(() => {
    fetch("/api/memos")
      .then((res) => res.json())
      .then((data) => setMemos(data.memos))
      .catch((err) => console.error("Failed to fetch memos:", err));
  }, []);

  // Process triggered by pressing the edit button.
  // Set the memo information to be edited to the state
  const handleEditClick = (memo) => {
    setEditingMemoId(memo._id);
    setEditedTitle(memo.title);
    setEditedContent(memo.content);
  };

  // Note update process
  // Send a PATCH request to the API and update the state if successful.
  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`/api/memos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editedTitle, content: editedContent }),
      });
      if (!res.ok) throw new Error("Failed to update memo");
      const updatedMemo = await res.json();
      setMemos((prev) =>
        prev.map((memo) => (memo._id === id ? updatedMemo : memo))
      );
      // Cancels the editing state and clears the edited contents.
      setEditingMemoId(null);
      setEditedTitle("");
      setEditedContent("");
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  // Note deletion process
  // Send a DELETE request to the API after confirming with the user
  // If successful, delete the relevant note from the state.
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this memo?")) return;
    try {
      const res = await fetch(`/api/memos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete memo");
      setMemos((prev) => prev.filter((memo) => memo._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // Switching between note completion states
  // Flip the current state and send a PATCH request to the API
  // If successful, update the state
  const handleToggleDone = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/memos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDone: !currentStatus }),
      });
      if (!res.ok) throw new Error("Failed to toggle status");
      const updatedMemo = await res.json();
      setMemos((prev) =>
        prev.map((memo) => (memo._id === id ? updatedMemo : memo))
      );
    } catch (error) {
      console.error("Toggle failed:", error);
    }
  };

  // Filter notes based on search keywords
  const filteredMemos = memos.filter(
    (memo) =>
      memo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memo.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 font-sans">
      <h1 className="text-5xl font-bold text-center text-gray-900 mb-10">
        📝 Your Memos
      </h1>
      {/* Search box*/}
      <input
        type="text"
        placeholder="Search by title or content..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-6 p-3 border border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
      />
      <div className="space-y-6">
        {/* Rendering the list of notes with a map*/}
        {filteredMemos.map((memo) => (
          <div
            key={memo._id}
            className="bg-white border border-gray-200 shadow-sm rounded-lg p-7 hover:shadow-lg transition"
          >
            <div className="flex items-start gap-4">
              {/* Completed state checkbox */}
              <input
                type="checkbox"
                checked={memo.isDone || false}
                onChange={() => handleToggleDone(memo._id, memo.isDone)}
                className="mt-1 w-5 h-5 accent-indigo-500"
              />
              <div className="flex-1">
                {/* If editing, display input form */}
                {editingMemoId === memo._id ? (
                  <>
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="w-full mb-2 p-2 border border-gray-400 rounded-md"
                    />
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full p-2 border border-gray-400 rounded-md"
                    />
                    {/* Save/Cancel button*/}
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => handleUpdate(memo._id)}
                        className="font-semibold bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-md transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingMemoId(null)}
                        className="font-semibold bg-gray-400 hover:bg-gray-500 text-gray-800 px-5 py-2.5 rounded-md transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* If not edited, the title and content are displayed. */}
                    <h3
                      className={`text-2xl font-semibold ${
                        memo.isDone
                          ? "line-through text-gray-500"
                          : "text-gray-800"
                      }`}
                    >
                      {memo.title}
                    </h3>
                    <p
                      className={`mt-1 text-gray-700 ${
                        memo.isDone ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {memo.content}
                    </p>
                    {/* Edit/Delete button */}
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => handleEditClick(memo)}
                        className="font-semibold bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-md transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(memo._id)}
                        className="font-semibold bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-md transition"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>{" "}
      {/* Div that encloses the list of notes */}
    </div>
  );
};

export default MemoList;
