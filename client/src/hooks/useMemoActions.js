// src/hooks/useMemoAction.js
import { useCallback } from "react";
import { createMemo, updateMemo, deleteMemo } from "../api";
import { toast } from "react-hot-toast";

/**
 * Custom hooks to handle actions on memos (create, update, delete, pin, mark as done)
 */
export const useMemoActions = ({
  token,
  loadMemos,
  setLoading,
  setError,
  setEditingMemoId,
}) => {
  // 🔸 New memo creation process
  const handleCreate = useCallback(
    async (title, content, category, attachments = []) => {
      if (!token) {
        toast.error("ログインが必要です。");
        setError("ログインが必要です。");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await createMemo(token, {
          title,
          content,
          category,
          attachments,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "メモ作成に失敗しました。");
        }

        await loadMemos();
        toast.success("メモを作成しました！");
      } catch (err) {
        console.error("メモ作成エラー:", err);
        toast.error(err.message || "メモ作成中にエラーが発生しました。");
        setError(err.message || "メモ作成中にエラーが発生しました。");
      } finally {
        setLoading(false);
      }
    },
    [token, loadMemos, setLoading, setError]
  );

  // 🔸 Editing and updating memos
  const handleUpdate = useCallback(
    async (id, title, content, category, attachments = undefined) => {
      if (!token) {
        toast.error("ログインが必要です。");
        setError("ログインが必要です。");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const payload = {
          title,
          content,
          category,
        };

        // 添付ファイルが明示的に指定されている場合のみ更新対象に含める
        if (attachments !== undefined) {
          payload.attachments = attachments;
        }

        const response = await updateMemo(token, id, payload);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "メモ更新に失敗しました。");
        }

        await loadMemos();
        setEditingMemoId(null);
        toast.success("メモを更新しました！");
      } catch (err) {
        console.error("メモ更新エラー:", err);
        toast.error(err.message || "メモ更新中にエラーが発生しました。");
        setError(err.message || "メモ更新中にエラーが発生しました。");
      } finally {
        setLoading(false);
      }
    },
    [token, loadMemos, setLoading, setError, setEditingMemoId]
  );

  // 🔸 Deleting memos (moving to trash)
  const handleDelete = useCallback(
    async (id) => {
      if (!token) {
        toast.error("ログインが必要です。");
        setError("ログインが必要です。");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await deleteMemo(token, id);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "メモ削除に失敗しました。");
        }

        await loadMemos();
        toast.success("メモをゴミ箱に移動しました。");
      } catch (err) {
        console.error("メモ削除エラー:", err);
        toast.error(err.message || "メモ削除中にエラーが発生しました。");
        setError(err.message || "メモ削除中にエラーが発生しました。");
      } finally {
        setLoading(false);
      }
    },
    [token, loadMemos, setLoading, setError]
  );

  // 🔸 Switching the completion state (flipping isDone true/false)
  const handleToggleDone = useCallback(
    async (memo) => {
      if (!token) {
        toast.error("ログインが必要です。");
        setError("ログインが必要です。");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await updateMemo(token, memo._id, {
          title: memo.title,
          content: memo.content,
          isDone: !memo.isDone,
        });

        if (!response.ok) {
          throw new Error("完了状態の切り替えに失敗しました。");
        }

        await loadMemos();
      } catch (err) {
        console.error("完了切り替えエラー:", err);
        toast.error(err.message || "完了状態の更新中にエラーが発生しました。");
        setError(err.message || "完了状態の更新中にエラーが発生しました。");
      } finally {
        setLoading(false);
      }
    },
    [token, loadMemos, setLoading, setError]
  );

  // 🔸 Pin state switching process (flipping true/false of isPinned)
  const handleTogglePin = useCallback(
    async (memo) => {
      if (!token) {
        toast.error("ログインが必要です。");
        return;
      }

      setLoading(true);

      try {
        const response = await updateMemo(token, memo._id, {
          isPinned: !memo.isPinned,
        });

        if (!response.ok) {
          throw new Error("ピン状態の更新に失敗しました。");
        }

        await loadMemos();
      } catch (err) {
        console.error("ピン切り替えエラー:", err);
        toast.error(err.message || "ピン状態の更新中にエラーが発生しました。");
      } finally {
        setLoading(false);
      }
    },
    [token, loadMemos, setLoading]
  );

  // 🔸 Returns a set of functions to be used externally
  return {
    handleCreate,
    handleUpdate,
    handleDelete,
    handleToggleDone,
    handleTogglePin,
  };
};
