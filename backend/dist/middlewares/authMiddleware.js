"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const envConfig_1 = require("@config/envConfig");
/**
 * Middleware за валидиране на JWT токен от HTTP заглавката Authorization.
 *
 * Стъпки:
 * 1. Проверява дали е предоставен хедър Authorization с Bearer токен.
 * 2. Извлича токена и се опитва да го валидира с jwt.verify().
 * 3. Ако е валиден – добавя декодираната информация в req.user и продължава.
 * 4. Ако не – връща статус 401 (ако липсва токен) или 403 (ако токенът е невалиден/изтекъл).
 */
const authMiddleware = (req, res, next) => {
    // Вземане на стойността на заглавката Authorization (напр. "Bearer eyJhbGci...")
    const authHeader = req.headers.authorization;
    // Стъпка 1: Проверка дали Authorization header съществува и е във формат "Bearer ..."
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        // Ако липсва токен – връщаме статус 401 (Unauthorized)
        res.status(401).sendJson({ message: "No token provided" });
        return;
    }
    //  Стъпка 2: Извличане на токена (втората част след "Bearer ")
    const token = authHeader.split(" ")[1];
    try {
        // Стъпка 3: Валидиране на токена чрез jwt.verify()
        const decoded = jsonwebtoken_1.default.verify(token, envConfig_1.JWT_SECRET);
        // Успешно декодиран токен – запазваме потребителските данни в req.user
        req.user = decoded;
        // Продължаваме към следващия middleware или маршрут
        next();
    }
    catch (err) {
        // Стъпка 4: Ако токенът е невалиден или изтекъл – статус 403 (Forbidden)
        res.status(403).sendJson({ message: "Invalid or expired token" });
    }
};
exports.default = authMiddleware;
