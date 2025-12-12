import { auth, provider } from "../../services/firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("ログイン成功:", result.user);
      // ログイン成功したら /home へ
      navigate("/home");
    } catch (error) {
      console.error("ログイン失敗:", error);
    }
  };

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>ログイン</h1>
      <button onClick={handleLogin}>Googleでログイン</button>
    </div>
  );
}

export default Login;
