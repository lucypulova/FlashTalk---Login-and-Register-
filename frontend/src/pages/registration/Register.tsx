import RegisterForm from "@/components/forms/RegisterForm";
import styles from "@/styles/AuthLayout.module.css";
import { useEffect } from "react";

const Register = () => {
  useEffect(() => {
      document.title = "FlashTalk | Registration";
    }, []);
  
  return (
    <div className={styles.wrapper}>
      <RegisterForm />
    </div>
  );
};

export default Register;
