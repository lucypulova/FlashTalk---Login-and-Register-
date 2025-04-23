"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveUsersToFile = exports.users = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Път до JSON файла, в който ще съхраняваме потребителите
 */
const USERS_FILE = path_1.default.join(__dirname, "users.json");
/**
 * Масив с потребители – зарежда се от файла при стартиране
 */
exports.users = [];
try {
    const data = fs_1.default.readFileSync(USERS_FILE, "utf8");
    exports.users = JSON.parse(data); // парсваме JSON от файла
}
catch (err) {
    console.log("Could not read users file. Starting with an empty array.");
    exports.users = [];
}
/**
 * Функция за запис на потребителите обратно във файла
 */
const saveUsersToFile = () => {
    fs_1.default.writeFileSync(USERS_FILE, JSON.stringify(exports.users, null, 2), "utf8");
};
exports.saveUsersToFile = saveUsersToFile;
