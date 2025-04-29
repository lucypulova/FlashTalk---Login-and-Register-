import { useEffect } from "react"; // React Hook - Изпълнява код при зареждане или при промяна на нещо 
import { useDispatch, useSelector } from "react-redux"; //React-Redux Hooks - Изпраща actions и	Чете данни от Redux store-а
import { validateToken } from "@/store/authSlice";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // правиш различни страници в React без презареждане
import Register from "@/pages/registration/Register";
import Login from "@/pages/login/Login";
import Chat from "@/pages/chat/Chat";
import { RootState, Dispatch } from "@/store/store";
import RestrictedRoute from "@/components/routes/RestrictedRoute";

const App = () => {
  const dispatch = useDispatch<Dispatch>(); // да изпращам actions към store; типизиран
  const token = useSelector((state: RootState) => state.auth.token); // взимам  текущия token

  useEffect(() => {
    // При стартиране проверяваме дали има токен
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(validateToken()); // дали е още валиден
    }
  }, [dispatch]);

  return (
    <BrowserRouter> {/*страниците се  сменят с различен адрес (URL)*/}
      <Routes>
        {/* Автоматично пренасочване от "/" */}
        <Route
          path="/"
          element={<Navigate to={token ? "/chat" : "/login"} replace />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/chat"
          element={
            <RestrictedRoute>
              <Chat />
            </RestrictedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
