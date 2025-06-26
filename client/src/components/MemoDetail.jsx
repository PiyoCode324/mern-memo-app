import React from "react";
import ReactMarkdown from "react-markdown";

const MemoDetail = ({ memo }) => {
  return (
    <div className="max-w-xl mx-auto p-4 bg-white dark:bg-gray-900 rounded shadow text-gray-900 dark:text-gray-100">
      <h2 className="text-2xl font-bold mb-4">{memo.title}</h2>
      <div className="prose max-w-none dark:prose-invert">
        <ReactMarkdown>{memo.content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default MemoDetail;
