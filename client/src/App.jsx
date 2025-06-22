import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MemoList from "./components/MemoList";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import PasswordResetRequest from "./pages/PasswordResetRequest";
import PasswordReset from "./pages/PasswordReset"; // PasswordResetコンポーネントをインポート

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          {/* ルートパス */}
          <Route path="/" element={<MemoList />} />
          {/* サインアップページ */}
          <Route path="/signup" element={<Signup />} />
          {/* ログインページ */}
          <Route path="/login" element={<Login />} />
          {/* パスワードリセット要求ページ */}
          <Route
            path="/password-reset-request"
            element={<PasswordResetRequest />}
          />
          {/*
            パスワードリセットページ:
            サーバーからのリンクがクエリパラメータ (?token=...) 形式になったため、
            React Routerのパスもパラメータなしの `/password-reset` に変更します。
            PasswordResetコンポーネント内で `useSearchParams` を使ってトークンを取得します。
          */}
          <Route path="/password-reset" element={<PasswordReset />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
