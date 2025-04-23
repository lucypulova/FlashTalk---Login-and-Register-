import { Router, Request, Response } from "express";
import authMiddleware from "@middlewares/authMiddleware";

const router = Router();

/**
 * Всички маршрути в този файл са защитени
 * - Добавяме middleware глобално (важи за всички по-долу)
 */
router.use(authMiddleware);

/**
 * GET /api/private/me
 * Връща информацията за логнатия потребител (от токена)
 */
router.get("/me", (req: Request, res: Response) => {
  res.sendJson(req.user, "Authenticated user data");
});

/**
 * GET /api/private/logout
 * Симулира logout (frontend трябва да изтрие токена)
 */
router.get("/logout", (req: Request, res: Response) => {
  res.sendJson(null, "Logged out (client should remove token)");
});

/**
 * GET /api/private/settings
 * Симулирани потребителски настройки
 */
router.get("/settings", (req: Request, res: Response) => {
  res.sendJson({
    theme: "dark",
    notifications: true,
    language: "en"
  }, "User settings");
});

export default router;

