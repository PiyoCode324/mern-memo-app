// client/src/api.js

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

export const fetchMemos = async (token) => {
  const res = await fetch(`${API_BASE_URL}/api/memos`, {
    // /api/memos
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
};

export const createMemo = async (token, memo) => {
  const res = await fetch(`${API_BASE_URL}/api/memos`, {
    // /api/memos
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(memo),
  });
  return res;
};

export const updateMemo = async (token, id, updatedData) => {
  const res = await fetch(`${API_BASE_URL}/api/memos/${id}`, {
    // /api/memos/:id
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedData),
  });
  return res;
};

export const deleteMemo = async (token, id) => {
  const res = await fetch(`${API_BASE_URL}/api/memos/${id}`, {
    // /api/memos/:id
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};
