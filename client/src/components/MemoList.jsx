// client/src/components/MemoList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// api.jsから全てのAPI関数をインポート
import { fetchMemos, createMemo, updateMemo, deleteMemo } from "../api";

const MemoList = () => {
  const navigate = useNavigate();
  const [memos, setMemos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editingMemoId, setEditingMemoId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // メモ一覧取得
  useEffect(() => {
    // トークンがない場合はログインページへリダイレクト
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError(null);

    const getMemos = async () => {
      try {
        // api.jsからインポートしたfetchMemos関数を使用
        const response = await fetchMemos(token);

        // 認証エラーの場合、トークンをクリアしてログインページへリダイレクト
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
          throw new Error("認証エラー: 再度ログインしてください。");
        }
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // レスポンスボディをJSONとしてパース
        setMemos(data.memos);
      } catch (err) {
        console.error("メモ取得エラー:", err);
        setError(err.message || "メモの取得に失敗しました。");
        setMemos([]); // エラー時は空の配列にしてmapエラーを防ぐ
      } finally {
        setLoading(false);
      }
    };

    getMemos(); // useEffect内で定義したasync関数を実行
  }, [token, navigate]); // tokenとnavigateを依存配列に追加

  // 新規メモ作成
  const handleCreate = async () => {
    if (!token) {
      setError("ログインが必要です。");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // api.jsからインポートしたcreateMemo関数を使用
      const response = await createMemo(token, {
        title: newTitle,
        content: newContent,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "メモ作成に失敗しました。");
      }

      const createdMemo = await response.json();
      setMemos([...memos, createdMemo]);
      setNewTitle("");
      setNewContent("");
    } catch (err) {
      console.error("メモ作成エラー:", err);
      setError(err.message || "メモ作成エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  // メモ削除
  const handleDelete = async (id) => {
    if (!token) {
      setError("ログインが必要です。");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // api.jsからインポートしたdeleteMemo関数を使用
      const response = await deleteMemo(token, id);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "メモ削除に失敗しました。");
      }

      setMemos(memos.filter((memo) => memo._id !== id));
    } catch (err) {
      console.error("削除エラー:", err);
      setError(err.message || "メモ削除エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  // 編集モードへ
  const startEditing = (memo) => {
    setEditingMemoId(memo._id);
    setEditedTitle(memo.title);
    setEditedContent(memo.content);
  };

  // メモ更新
  const handleUpdate = async (id) => {
    if (!token) {
      setError("ログインが必要です。");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // api.jsからインポートしたupdateMemo関数を使用
      const response = await updateMemo(token, id, {
        title: editedTitle,
        content: editedContent,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "メモ更新に失敗しました。");
      }

      const updatedMemo = await response.json();
      setMemos(memos.map((memo) => (memo._id === id ? updatedMemo : memo)));
      setEditingMemoId(null);
    } catch (err) {
      console.error("更新エラー:", err);
      setError(err.message || "メモ更新エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  // 完了状態トグル
  const handleToggleDone = async (memo) => {
    if (!token) {
      setError("ログインが必要です。");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // api.jsからインポートしたupdateMemo関数を再利用
      const response = await updateMemo(token, memo._id, {
        title: memo.title,
        content: memo.content,
        isDone: !memo.isDone,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "完了状態の切り替えに失敗しました。"
        );
      }

      const updatedMemo = await response.json();
      setMemos(memos.map((m) => (m._id === memo._id ? updatedMemo : m)));
    } catch (err) {
      console.error("完了状態の切り替えエラー:", err);
      setError(err.message || "完了状態の切り替えエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  // ログアウト処理
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/login"); // ログインページへリダイレクト
  };

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center flex-grow">
          📝 メモ一覧
        </h2>
        {token && ( // ログイン時にのみログアウトボタンを表示
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
          >
            ログアウト
          </button>

          
        )}
      </div>

      {loading && (
        <p className="text-blue-600 text-center mb-4">読み込み中...</p>
      )}
      {error && (
        <p className="text-red-500 text-center mb-4 font-medium">
          エラー: {error}
        </p>
      )}
      {!token && (
        <p className="text-blue-700 text-center mb-4">
          メモを見るにはログインしてください。
        </p>
      )}

      {/* 新規作成フォーム */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          📌 新しいメモを作成
        </h3>
        <input
          type="text"
          placeholder="タイトル"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-3"
          disabled={!token || loading}
        />
        <textarea
          placeholder="内容"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4 h-32 resize-y"
          disabled={!token || loading}
        />
        <button
          onClick={handleCreate}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!token || loading}
        >
          作成
        </button>
      </div>

      {memos.length === 0 && !loading && !error && token && (
        <p className="text-gray-600 text-center text-lg mt-8">
          メモがありません。新しいメモを作成しましょう！
        </p>
      )}

      {/* メモ表示エリア */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memos.map((memo) => (
          <div
            key={memo._id}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
          >
            {editingMemoId === memo._id ? (
              <div>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
                  disabled={loading}
                />
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 h-24 resize-y"
                  disabled={loading}
                />
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleUpdate(memo._id)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    保存
                  </button>
                  <button
                    onClick={() => setEditingMemoId(null)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3
                  className={`text-xl font-bold text-gray-800 mb-2 ${
                    memo.isDone ? "line-through text-gray-500" : ""
                  }`}
                >
                  {memo.title}
                </h3>
                <p className="text-gray-700 mb-3 text-base leading-relaxed">
                  {memo.content}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  完了: {memo.isDone ? "✅" : "❌"}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => startEditing(memo)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-lg text-sm transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(memo._id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-lg text-sm transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    削除
                  </button>
                  <button
                    onClick={() => handleToggleDone(memo)}
                    className={`font-bold py-2 px-3 rounded-lg text-sm transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                      memo.isDone
                        ? "bg-yellow-500 hover:bg-yellow-600 text-gray-800"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                    disabled={loading}
                  >
                    {memo.isDone ? "未完了にする" : "完了にする"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemoList;
