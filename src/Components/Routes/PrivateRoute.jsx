import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../Context/authHelpers";

const PrivateRoute = () => {
  const { token } = useAuth();  // Acessando o token diretamente a partir do context
  if (!token) {
    return <Navigate to="/login" />;  // Se não houver token, redireciona para o login
  }
  return <Outlet />;  // Caso tenha token, permite o acesso à rota protegida
};

export default PrivateRoute;
