import LoginForm from "@/components/forms/LoginForm";
import styles from "@/styles/AuthLayout.module.css";
import { useEffect } from "react";

const Login = () => {
  useEffect(() => {
    document.title = "FlashTalk | Login";
  }, []);

  return (
    <div className={styles.wrapper}>
      <LoginForm />
    </div>
  );
};

export default Login;
