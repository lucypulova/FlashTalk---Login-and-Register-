"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = __importDefault(require("node:http"));
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
//  Зареждаме променливите от .env файла
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Важно: да е най-отгоре, преди да използваме process.env
const envConfig_1 = require("@config/envConfig");
const corsConfig_1 = __importDefault(require("@config/corsConfig"));
const responseTypeMiddlware_1 = __importDefault(require("@middlewares/responseTypeMiddlware"));
const userController = __importStar(require("@controllers/usersController"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes")); // или @routes/... ако имаш alias
const protectedRoutes_1 = __importDefault(require("@routes/protectedRoutes"));
// Basic config
const app = (0, express_1.default)();
app.use((0, cors_1.default)(corsConfig_1.default));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(responseTypeMiddlware_1.default);
/**
 * Бизнес-логика - авторизация и др http запроси (DR1, DR3, DR5)
 */
// Регистрация на API за login/register
app.use("/api/auth", authRoutes_1.default); // login, register
// Защитени API маршрути
app.use("/api/private", protectedRoutes_1.default); // me, settings, etc.
app.get('/', userController.getUser);
/**
 * Сокет соединение - DR4
 */
const server = node_http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: corsConfig_1.default
});
const userSessions = [];
io.on("connection", (socket) => {
    console.log("Нов потребител е свързан:", socket.id);
    socket.on("message", (data) => {
        console.log("Съобщение:", data);
        io.emit("message", data);
    });
    socket.on("disconnect", () => {
        console.log("Потребителят прекъсна връзката:", socket.id);
    });
});
//Server start
server.listen(envConfig_1.SERVER_PORT, () => {
    console.log(`[server]: Server is running at http://${envConfig_1.SERVER_HOSTNAME}:${envConfig_1.SERVER_PORT}`);
});
