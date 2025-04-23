import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, Dispatch } from "@/store/store";
import { validateToken } from "@/store/authSlice";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const RestrictedRoute = ({ children }: Props) => {
  const dispatch = useDispatch<Dispatch>();
  const { token, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // При наличен токен, валидираме при първо зареждане
    if (token && !user) {
      dispatch(validateToken());
    }
  }, [token, user, dispatch]);

  // Ако няма токен, пренасочваме към login
  if (!token) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export default RestrictedRoute;
