// client/src/api.js

import { apiFetch } from "./apiFetch";
// .envファイルに REACT_APP_API_URL=http://localhost:3000 と設定している前提
// API_URL はベースURLのみとし、'/api' は各エンドポイントで付与する
const API_BASE_URL = process.env.REACT_APP_API_URL;

// 各API関数は、HTTPレスポンスオブジェクトそのものを返すように変更されています。
// これにより、呼び出し元のコンポーネントでres.okやres.statusをチェックできます。

export const signup = async (email, password) => {
  const res = await fetch(`${API_BASE_URL}/api/signup`, {
    // /api/signup
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res;
};

export const login = async (email, password) => {
  const res = await fetch(`${API_BASE_URL}/api/login`, {
    // /api/login
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res;
};

export const fetchMemos = async (token, page = 1, limit = 10) => {
  return apiFetch(`${API_BASE_URL}/api/memos?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createMemo = async (token, memo) => {
  return apiFetch(`${API_BASE_URL}/api/memos`, {
    // /api/memos
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(memo),
  });
};

export const updateMemo = async (token, id, updatedData) => {
  return apiFetch(`${API_BASE_URL}/api/memos/${id}`, {
    // /api/memos/:id
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedData),
  });
};

export const deleteMemo = async (token, id) => {
  return apiFetch(`${API_BASE_URL}/api/memos/${id}`, {
    // /api/memos/:id
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const passwordResetRequest = async (email) => {
  return fetch(`${API_BASE_URL}/api/password-reset-request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
};

export const passwordReset = async (token, newPassword) => {
  return fetch(`${API_BASE_URL}/api/password-reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });
};

export const fetchMemo = async (token, id) => {
  return apiFetch(`${API_BASE_URL}/api/memos/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchTrashedMemos = async (token, page, limit) => {
  return apiFetch(
    `${API_BASE_URL}/api/memos/trash?page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const restoreMemo = async (token, id) => {
  return apiFetch(`${API_BASE_URL}/api/memos/${id}/restore`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const emptyTrash = async (token) => {
  return apiFetch(`${API_BASE_URL}/api/memos/trash`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
};
