import fs from "fs";
import path from "path";

/**
 * Тип на потребител – използваме го навсякъде
 */
export interface User {
  username: string;
  email: string;
  password: string; // хеширана
  displayName: string;
}

/**
 * Път до JSON файла, в който ще съхраняваме потребителите
 */
const USERS_FILE = path.join(__dirname, "users.json");

/**
 * Масив с потребители – зарежда се от файла при стартиране
 */
export let users: User[] = [];

try {
  const data = fs.readFileSync(USERS_FILE, "utf8");
  users = JSON.parse(data); // парсваме JSON от файла
} catch (err) {
  console.log("Could not read users file. Starting with an empty array.");
  users = [];
}

/**
 * Функция за запис на потребителите обратно във файла
 */
export const saveUsersToFile = () => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
};



