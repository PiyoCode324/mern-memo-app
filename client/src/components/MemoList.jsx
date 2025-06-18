import React, { useEffect, useState } from "react";

const MemoList = () => {
  // State to store the list of memos
  const [memos, setMemos] = useState([]);

  // Fetch memos from the API when component mounts
  useEffect(() => {
    fetch("/api/memos")
      .then((res) => res.json())
      .then((data) => {
        // Update state with received memos
        setMemos(data.memos);
      })
      .catch((err) => {
        // Handle fetch error
        console.error("Failed to fetch memos:", err);
      });
  }, []);

  return (
    <div>
      <h2>📝 Memo List</h2>
      <ul>
        {/* Map through memos and display each */}
        {memos.map((memo) => (
          <li key={memo._id}>
            <strong>{memo.title}</strong>: {memo.content}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemoList;
