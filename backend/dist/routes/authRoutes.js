"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constantUsers_1 = require("../data/constantUsers");
const envConfig_1 = require("@config/envConfig");
const router = (0, express_1.Router)();
/**
 * Проверява дали имейл адресът е във валиден формат
 */
const isValidEmail = (email) => {
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
const handleRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const emailExists = constantUsers_1.users.some(u => u.email === email);
    if (emailExists) {
        //console.log("Jopa")
        res.status(409).json({ message: "Email already in use." });
        return;
    }
    // Хеширане на паролата
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    // Създаване на потребителя
    const newUser = { username, email, password: hashedPassword, displayName };
    constantUsers_1.users.push(newUser);
    (0, constantUsers_1.saveUsersToFile)(); // Запис в JSON файла
    res.status(201).json({
        message: "User registered successfully",
        user: { username, displayName, email }
    });
});
/**
 * Вход на потребител
 * - Валидира входни данни
 * - Проверява дали потребителят съществува
 * - Сравнява паролата с хеша
 * - Издава JWT токен при успех
 */
const handleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const user = constantUsers_1.users.find(u => u.email === email);
    if (!user) {
        res.status(401).json({ message: "Invalid email or password." });
        return;
    }
    // Грешна парола
    const isMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        res.status(401).json({ message: "Invalid email or password." });
        return;
    }
    // Създаваме JWT токен
    const token = jsonwebtoken_1.default.sign({
        email: user.email,
        username: user.username,
        displayName: user.displayName
    }, envConfig_1.JWT_SECRET, { expiresIn: "2h" });
    res.status(200).json({
        message: "Login successful",
        token, // 🪙 Изпращаме токена към клиента
        user: {
            username: user.username,
            displayName: user.displayName,
            email: user.email
        }
    });
});
// Рутове
router.post("/register", handleRegister);
router.post("/login", handleLogin);
exports.default = router;
