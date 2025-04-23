import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/api/axios";

///////////////////////////////////////////////////////
// Типове – гарантират типова сигурност с TypeScript //
///////////////////////////////////////////////////////

/**
 * Тип за потребител – съдържа основните данни за логнатия потребител.
 */
interface User {
  username: string;
  email: string;
  displayName: string;
}

/**
 * Тип за състоянието на auth slice.
 */
interface AuthState {
  user: User | null; // null означава, че няма логнат потребител
  token: string | null; // JWT токен за удостоверяване
  status: "idle" | "loading" | "succeeded" | "failed"; // статус на заявката
  error: string | null; // грешка при заявките
  isInitialized: boolean; // показва дали вече е извършена проверка на токена
}

// Начално състояние
const initialState: AuthState = {
  user: null,
  token: null,
  status: "idle",
  error: null,
  isInitialized: false, // поставяме true след първоначалната проверка на токена
};

///////////////////////////////////////////
// Thunks – асинхронни действия чрез Axios //
///////////////////////////////////////////

/**
 * Регистрация на потребител.
 * Изпраща POST заявка до /auth/register с потребителските данни.
 */
const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    userData: { username: string; email: string; password: string; displayName: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post("/auth/register", userData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

/**
 * Вход на потребител (login).
 * Изпраща POST заявка до /auth/login с имейл и парола.
 * При успех получаваме потребител и токен.
 */
const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post("/auth/login", credentials);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

/**
 * Проверка дали токенът е валиден.
 * Използва се при презареждане на приложението – ако има токен в localStorage,
 * извършваме заявка към /private/me и валидираме автентичността.
 */
const validateToken = createAsyncThunk(
  "auth/validateToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/private/me");
      return response.data.data; // получаваме user данните
    } catch (err: any) {
      return rejectWithValue("Token validation failed");
    }
  }
);

/////////////////////////////////////////////////////
// Slice – управлява auth състоянието и действия  //
/////////////////////////////////////////////////////

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Изход от профила.
     * Занулява потребителя и токена от store и localStorage.
     */
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
      state.isInitialized = true;
      localStorage.removeItem("token"); // Премахваме токена от localStorage
    }
  },
  extraReducers: (builder) => {
    // Регистрация
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token || null;
      })
      .addCase(registerUser.rejected, (state, action: PayloadAction<any>) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Вход
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token || null;

        // Ако имаме токен, го записваме в localStorage за последващи заявки
        if (action.payload.token) {
          localStorage.setItem("token", action.payload.token);
        }
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Валидация на токен
    builder
      .addCase(validateToken.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(validateToken.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isInitialized = true; // Вече е направена проверка
      })
      .addCase(validateToken.rejected, (state, action: PayloadAction<any>) => {
        state.status = "failed";
        state.user = null;
        state.token = null;
        state.error = action.payload;
        state.isInitialized = true;
        localStorage.removeItem("token"); // Премахваме невалидния токен
      });
  }
});

//////////////////////////////////////////////////////
// Експорт на reducer и асинхронни действия (thunks)
//////////////////////////////////////////////////////

export const { logout } = authSlice.actions;
export default authSlice.reducer;
export { registerUser, loginUser, validateToken };
