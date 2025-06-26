import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  // Get the token from local storage
  const token = localStorage.getItem("token");

  //// Redirect to the login page if the user is not authenticated
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // // Fetch user profile data from the backend
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/users/profile", {
          headers: {
            // Send the token to the backend
            Authorization: `Bearer ${token}`,
          },
        });
        // Error Handling
        if (!res.ok) {
          throw new Error("プロフィール情報の取得に失敗しました。");
        }
        // Parse the response as JSON
        const data = await res.json();
        // Store the profile data in state
        setProfile(data);
        // Handle errors
      } catch (err) {
        setError(err.message);
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    };
    // Check login status and get profile information
    fetchProfile();
  }, [token, navigate]); // Re-execute when the token changes or a screen transition is required

  // エラーが発生した場合の表示（例: トークン切れなど）
  if (error) {
    return (
      <div className="text-red-500 text-center mt-6">
        <p>{error}</p>
        <p>2秒後にログイン画面へ移動します...</p>
      </div>
    );
  }
  {
    /* プロフィールデータがまだ読み込まれていない場合（ローディング中） */
  }
  if (!profile) {
    return <p className="text-center mt-6">読み込み中...</p>;
  }
  {
    /*  正常にプロフィール情報を取得できた場合の表示*/
  }
  return (
    <div className="max-w-md mx-auto mt-8 p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">ユーザープロファイル</h2>
      <p>
        <strong>メールアドレス:</strong> {profile.email}
      </p>
      <p>
        <strong>登録日:</strong>{" "}
        {new Date(profile.createdAt).toLocaleDateString()}
      </p>
      <p>
        <strong>メモ数:</strong> {profile.memoCount}
      </p>
      <button
        onClick={() => navigate("/")}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        メモ一覧に戻る
      </button>
    </div>
  );
};

export default Profile;
