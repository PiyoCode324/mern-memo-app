import React from "react";
import MemoList from "./components/MemoList";

const App = () => {
  // Main app component
  return (
    <div>
      {/* App title */}
      <h1>Memo App</h1>
      {/* Render the list of memos */}
      <MemoList />
    </div>
  );
};

export default App;
