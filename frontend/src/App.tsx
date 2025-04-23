import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { validateToken } from "@/store/authSlice";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "@/pages/registration/Register";
import Login from "@/pages/login/Login";
import Chat from "@/pages/chat/Chat";
import { RootState, Dispatch } from "@/store/store";

const App = () => {
  const dispatch = useDispatch<Dispatch>();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    // При стартиране проверяваме дали има токен
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(validateToken());
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Автоматично пренасочване от "/" */}
        <Route
          path="/"
          element={<Navigate to={token ? "/chat" : "/login"} replace />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
