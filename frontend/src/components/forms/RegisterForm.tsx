import { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "@/store/authSlice";
import { Dispatch } from "@/store/store";
import { Link, useNavigate } from "react-router-dom";
import styles from "./RegisterForm.module.css";

// Интерфейс за формата – типизация на въведените стойности
interface FormData {
  fullName: string;
  nickname: string;
  email: string;
  password: string;
  repeatPassword: string;
}

const RegisterForm = () => {
  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();

  // Състояние на въведените стойности от потребителя
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    nickname: "",
    email: "",
    password: "",
    repeatPassword: ""
  });

  // Състояние за валидационни грешки при отделни полета
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  // Състояние за глобални грешки (например от сървъра)
  const [serverError, setServerError] = useState("");

  // Проверява дали всички полета са попълнени (за деактивиране на бутона)
  const isFormFilled = Object.values(formData).every(val => val.trim() !== "");

  // Функция за валидация на формата
  const validateForm = () => {
    const errors: Partial<FormData> = {};

    // Проверка за задължителни полета и конкретни условия
    if (!formData.fullName.trim()) errors.fullName = "Full name is required.";
    if (!formData.nickname.trim()) errors.nickname = "Nickname is required.";

    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format.";
    }

    if (!formData.password) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    if (!formData.repeatPassword) {
      errors.repeatPassword = "Please repeat your password.";
    } else if (formData.password !== formData.repeatPassword) {
      errors.repeatPassword = "Passwords do not match.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Обработка при промяна на някое поле от формата
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Актуализиране на въведената стойност
    setFormData(prev => ({ ...prev, [name]: value }));

    // Изчистване на локалната грешка за текущото поле (ако има)
    setFormErrors(prev => ({ ...prev, [name]: undefined }));

    // Изчистване на глобалната сървърна грешка
    setServerError("");
  };

  // Обработка при изпращане на формата
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ако има грешки – не изпращаме заявка
    if (!validateForm()) return;

    // Изпращаме заявка за регистрация
    const resultAction = await dispatch(registerUser({
      username: formData.nickname,
      email: formData.email,
      password: formData.password,
      displayName: formData.fullName
    }));

    // При успех – пренасочваме към chat
    if (registerUser.fulfilled.match(resultAction)) {
      navigate("/chat");
    }
    // При неуспех – показваме съобщение от сървъра
    else if (registerUser.rejected.match(resultAction)) {
      const errorMsg = resultAction.payload as string;
      setServerError(errorMsg || "Registration failed. Try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.heading}>Register to FlashTalk</h2>

      {/* Полетата от формата – рендират се от масив за по-кратко */}
      {[ 
        { name: "fullName", label: "Full Name", placeholder: "Enter your full name" },
        { name: "nickname", label: "Nickname", placeholder: "Choose a nickname" },
        { name: "email", label: "Email", placeholder: "Enter your email", type: "email" },
        { name: "password", label: "Password", placeholder: "Enter a password", type: "password" },
        { name: "repeatPassword", label: "Repeat Password", placeholder: "Repeat your password", type: "password" },
      ].map(({ name, label, placeholder, type = "text" }) => (
        <div key={name} className={styles.inputGroup}>
          <label htmlFor={name} className={styles.label}>{label}</label>
          <input
            type={type}
            name={name}
            id={name}
            value={formData[name as keyof FormData]}
            onChange={handleChange}
            placeholder={placeholder}
            className={`${styles.input} ${formErrors[name as keyof FormData] ? styles.inputError : ""}`}
          />
          {/* Показване на грешка под полето, ако има такава */}
          {formErrors[name as keyof FormData] && (
            <p className={styles.errorText}>{formErrors[name as keyof FormData]}</p>
          )}
        </div>
      ))}

      {/* Глобална грешка от сървъра, например дублиран имейл */}
      {serverError && (
        <p className={styles.errorText} style={{ textAlign: "center" }}>
          {serverError}
        </p>
      )}

      {/* Бутон за регистрация */}
      <button
        type="submit"
        className={styles.button}
        disabled={!isFormFilled}
      >
        Register
      </button>

      {/* Линк към login страница за потребители с акаунт */}
      <p className={styles.bottomText}>
        Already have an account?{" "}
        <Link to="/login" className={styles.loginLink}>
          Login here
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
