import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MemoList from "./components/MemoList";
// App.jsx or App.js などでルーティング
import Signup from "./pages/Signup";
import Login from "./pages/Login"; // <-- 新しく追加する

const App = () => {
  // Main app component
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<MemoList />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} /> {/* <-- 新しく追加する */}
        </Routes>
      </Router>
    </div>
  );
};

export default App;
