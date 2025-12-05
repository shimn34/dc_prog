import { auth, provider } from "../../services/firebase";
import { signInWithPopup } from "firebase/auth";

function Login() {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("ログイン成功:", result.user);

      // ここでホーム画面に遷移する実装を後で追加する
      // 例: navigate("/home");
    } catch (error) {
      console.error("ログイン失敗:", error);
    }
  };

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>ログイン</h1>
      <button onClick={handleLogin}>
        Googleでログイン
      </button>
    </div>
  );
}

export default Login;
