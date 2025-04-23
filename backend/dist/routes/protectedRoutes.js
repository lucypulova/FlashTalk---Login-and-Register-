"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("@middlewares/authMiddleware"));
const router = (0, express_1.Router)();
/**
 * Всички маршрути в този файл са защитени
 * - Добавяме middleware глобално (важи за всички по-долу)
 */
router.use(authMiddleware_1.default);
/**
 * GET /api/private/me
 * Връща информацията за логнатия потребител (от токена)
 */
router.get("/me", (req, res) => {
    res.sendJson(req.user, "Authenticated user data");
});
/**
 * GET /api/private/logout
 * Симулира logout (frontend трябва да изтрие токена)
 */
router.get("/logout", (req, res) => {
    res.sendJson(null, "Logged out (client should remove token)");
});
/**
 * GET /api/private/settings
 * Симулирани потребителски настройки
 */
router.get("/settings", (req, res) => {
    res.sendJson({
        theme: "dark",
        notifications: true,
        language: "en"
    }, "User settings");
});
exports.default = router;
