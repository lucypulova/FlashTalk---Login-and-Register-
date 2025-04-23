import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/store/authSlice";
import { Dispatch, RootState } from "@/store/store";
import { Link, useNavigate } from "react-router-dom";
import styles from "./LoginForm.module.css";

// Типизация на входните данни от формата
interface LoginData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();

  // Вземаме текущия статус на auth slice (idle, loading, succeeded, failed)
  const { status } = useSelector((state: RootState) => state.auth);

  // Състояние за стойностите от формата
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: ""
  });

  // Състояние за грешки при валидация
  const [formErrors, setFormErrors] = useState<Partial<LoginData>>({});
  // Състояние за сървърна грешка
  const [serverError, setServerError] = useState("");

  // Активиране на бутона само ако всички полета са попълнени
  const isFormFilled = formData.email.trim() !== "" && formData.password.trim() !== "";

  // Валидация на въведените данни – връща true само ако всичко е коректно
  const validateForm = () => {
    const errors: Partial<LoginData> = {};

    // Валидация на имейл
    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format.";
    }

    // Валидация на парола
    if (!formData.password) {
      errors.password = "Password is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Обработка при промяна в полетата – обновява данните и изчиства грешки
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Изчистваме грешките локално за това поле
    setFormErrors({ ...formErrors, [e.target.name]: undefined });

    // Изчистваме евентуално показано сървърно съобщение за грешка
    setServerError("");
  };

  // Изпращане на формата за вход
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ако формата е невалидна, прекъсваме изпращането
    if (!validateForm()) return;

    // Извикваме login thunk с подадените данни
    const result = await dispatch(loginUser(formData));

    // Ако заявката е успешна – пренасочваме към чат страницата
    if (loginUser.fulfilled.match(result)) {
      navigate("/chat");

    // Ако заявката е неуспешна – показваме съобщението от сървъра
    } else if (loginUser.rejected.match(result)) {
      const errorMsg = result.payload as string;
      setServerError(errorMsg || "Login failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.heading}>Login to FlashTalk</h2>

      {/* Генериране на полетата от формата */}
      {[
        { name: "email", label: "Email", placeholder: "Enter your email", type: "email" },
        { name: "password", label: "Password", placeholder: "Enter your password", type: "password" }
      ].map(({ name, label, placeholder, type = "text" }) => (
        <div key={name} className={styles.inputGroup}>
          <label htmlFor={name} className={styles.label}>{label}</label>
          <input
            type={type}
            name={name}
            id={name}
            value={formData[name as keyof LoginData]}
            onChange={handleChange}
            placeholder={placeholder}
            className={`${styles.input} ${formErrors[name as keyof LoginData] ? styles.inputError : ""}`}
          />
          {/* Ако има грешка за това поле – показваме я */}
          {formErrors[name as keyof LoginData] && (
            <p className={styles.errorText}>{formErrors[name as keyof LoginData]}</p>
          )}
        </div>
      ))}

      {/* Грешка, върната от сървъра */}
      {serverError && (
        <p className={styles.errorText} style={{ textAlign: "center" }}>
          {serverError}
        </p>
      )}

      {/* Бутон за вход – деактивира се при loading или непопълнени полета */}
      <button
        type="submit"
        className={styles.button}
        disabled={!isFormFilled || status === "loading"}
      >
        {status === "loading" ? "Logging in..." : "Login"}
      </button>

      {/* Линк за потребители без акаунт */}
      <p className={styles.bottomText}>
        Don't have an account?{" "}
        <Link to="/register" className={styles.registerLink}>
          Register here
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
