import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { uploadFile } from "../hooks/utils/uploadFile";

const MemoForm = ({ token, loading, onCreate }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  // ファイル選択時の処理
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    // 画像はbase64プレビュー、PDFはファイル名表示
    const newPreviews = [];
    selectedFiles.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          newPreviews.push({
            type: "image",
            src: reader.result,
            name: file.name,
          });
          if (newPreviews.length === selectedFiles.length)
            setPreviews(newPreviews);
        };
        reader.readAsDataURL(file);
      } else if (file.type === "application/pdf") {
        newPreviews.push({ type: "pdf", name: file.name });
        if (newPreviews.length === selectedFiles.length)
          setPreviews(newPreviews);
      } else {
        toast.error("対応していないファイル形式が含まれています。");
      }
    });
  };

  // プレビューからファイルを削除
  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!token) {
      toast.error("ログインが必要です。");
      return;
    }
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error("タイトルと内容を入力してください。");
      return;
    }
    if (!newCategory) {
      toast.error("カテゴリを選択してください。");
      return;
    }

    try {
      setUploading(true);

      const fileUrls = await Promise.all(files.map((file) => uploadFile(file)));

      const attachments = fileUrls.map((url, idx) => ({
        url,
        name: files[idx].name,
        type: files[idx].type,
      }));

      // ✅ 個別に分けて渡す
      await onCreate(newTitle, newContent, newCategory, attachments);

      setNewTitle("");
      setNewContent("");
      setNewCategory("");
      setFiles([]);
      setPreviews([]);
      toast.success("メモを作成しました！");
    } catch (err) {
      console.error(err);
      toast.error("ファイルのアップロードまたはメモ作成に失敗しました。");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-100 mb-4">
        📌 新しいメモを作成
      </h3>
      <input
        type="text"
        placeholder="タイトル"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        disabled={!token || loading || uploading}
        className="w-full px-4 py-2 mb-3 border rounded-md"
      />
      <textarea
        placeholder="内容"
        value={newContent}
        onChange={(e) => setNewContent(e.target.value)}
        disabled={!token || loading || uploading}
        className="w-full px-4 py-2 mb-4 h-32 resize-y border rounded-md"
      />
      <select
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        disabled={!token || loading || uploading}
        className="w-full px-4 py-2 mb-4 border rounded-md"
      >
        <option value="">カテゴリを選択</option>
        <option value="仕事">仕事</option>
        <option value="日記">日記</option>
        <option value="買い物">買い物</option>
        <option value="アイデア">アイデア</option>
        <option value="その他">その他</option>
      </select>

      <input
        type="file"
        accept="image/*,application/pdf"
        multiple
        onChange={handleFileChange}
        disabled={!token || loading || uploading}
        className="mb-4"
      />

      {/* プレビュー表示 */}
      <div className="flex flex-wrap gap-4 mb-4">
        {previews.map((p, i) => (
          <div key={i} className="relative">
            {p.type === "image" ? (
              <img
                src={p.src}
                alt={p.name}
                className="w-20 h-20 object-cover rounded"
              />
            ) : (
              <div className="w-20 h-20 flex items-center justify-center bg-gray-200 rounded text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                PDF
              </div>
            )}
            <button
              onClick={() => handleRemoveFile(i)}
              type="button"
              className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!token || loading || uploading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
      >
        {uploading ? "アップロード中..." : "作成"}
      </button>
    </div>
  );
};

export default MemoForm;
