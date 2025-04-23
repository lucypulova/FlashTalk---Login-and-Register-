import { useDispatch, useSelector } from "react-redux";
import { RootState, Dispatch } from "@/store/store";
import { logout } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";
import styles from "./Chat.module.css";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const Chat = () => {
  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  // Изход от акаунта
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    document.title = "FlashTalk | Chat";
  }, []);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Welcome to FlashTalk!</h1>

      {user ? (
        <>
          <p style={{ fontSize: "1.2rem", marginTop: "1rem" }}>
            Hello, <strong>{user.displayName}</strong>!
          </p>
          <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
        </>
      ) : (
        <>
        <p style={{ color: "gray" }}>
        You're not logged in.{" "}
        <Link to="/login" className={styles.loginLinkStandalone}>
          Login
        </Link>
       </p>
        </>
      )}
    </div>
  );
};

export default Chat;
