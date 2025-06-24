import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MemoList from "./components/MemoList";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import PasswordResetRequest from "./pages/PasswordResetRequest";
import PasswordReset from "./pages/PasswordReset";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* / はログイン必須ルートにする */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MemoList />
            </ProtectedRoute>
          }
        />
        {/* 認証不要ページ */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/password-reset-request"
          element={<PasswordResetRequest />}
        />
        <Route path="/password-reset" element={<PasswordReset />} />
      </Routes>
    </Router>
  );
};

export default App;
