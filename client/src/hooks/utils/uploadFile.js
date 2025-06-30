// src/hooks/utils/uploadFile.js

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// 正しいパス（2つ上の階層に戻る）
import { storage } from "../../firebase";

/**
 * Firebase Storage にファイルをアップロードし、
 * ダウンロード URL を取得して返す関数
 *
 * @param {File} file - ブラウザで選択された File オブジェクト
 * @param {string} [folder="uploads"] - ストレージ内の保存先フォルダ名
 * @returns {Promise<string>} ダウンロード URL
 */
export const uploadFile = async (file, folder = "uploads") => {
  // ユニークなファイル名（タイムスタンプ + 元のファイル名）
  const fileName = `${Date.now()}_${file.name}`;

  // Storage リファレンスを作成
  const storageRef = ref(storage, `${folder}/${fileName}`);

  // ファイルをアップロード
  await uploadBytes(storageRef, file);

  // アップロード完了後のダウンロード URL を取得
  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
};
