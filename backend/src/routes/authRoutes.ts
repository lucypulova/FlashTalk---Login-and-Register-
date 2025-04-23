import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { users, User, saveUsersToFile } from "../data/constantUsers";
import { JWT_SECRET } from "@config/envConfig";

const router = Router();

/**
 * Проверява дали имейл адресът е във валиден формат
 */
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Регистрация на потребител
 * - Валидира входни данни
 * - Проверява за дублиран имейл
 * - Хешира паролата
 * - Записва потребителя във "фалшивата база" (users.json)
 */
const handleRegister = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password, displayName } = req.body;

  // Проверка за празни полета
  if (!username || !email || !password || !displayName) {
    res.status(400).json({ message: "All fields are required." });
    return;
  }

  // Невалиден имейл
  if (!isValidEmail(email)) {
    res.status(400).json({ message: "Invalid email format." });
    return;
  }

  // Имейлът вече се използва
  const emailExists = users.some(u => u.email === email);
  if (emailExists) {
    //console.log("Jopa")
    res.status(409).json({ message: "Email already in use." });
    return;
  }

  // Хеширане на паролата
  const hashedPassword = await bcrypt.hash(password, 10);

  // Създаване на потребителя
  const newUser: User = { username, email, password: hashedPassword, displayName };
  users.push(newUser);
  saveUsersToFile(); // Запис в JSON файла

  res.status(201).json({
    message: "User registered successfully",
    user: { username, displayName, email }
  });
};

/**
 * Вход на потребител
 * - Валидира входни данни
 * - Проверява дали потребителят съществува
 * - Сравнява паролата с хеша
 * - Издава JWT токен при успех
 */
const handleLogin = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  // Празни полета
  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required." });
    return;
  }

  // Невалиден имейл
  if (!isValidEmail(email)) {
    res.status(400).json({ message: "Invalid email format." });
    return;
  }

  // Потребителят не съществува
  const user = users.find(u => u.email === email);
  if (!user) {
    res.status(401).json({ message: "Invalid email or password." });
    return;
  }

  // Грешна парола
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401).json({ message: "Invalid email or password." });
    return;
  }

  // Създаваме JWT токен
  const token = jwt.sign(
    {
      email: user.email,
      username: user.username,
      displayName: user.displayName
    },
    JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.status(200).json({
    message: "Login successful",
    token, // 🪙 Изпращаме токена към клиента
    user: {
      username: user.username,
      displayName: user.displayName,
      email: user.email
    }
  });
};

// Рутове
router.post("/register", handleRegister);
router.post("/login", handleLogin);

export default router;
