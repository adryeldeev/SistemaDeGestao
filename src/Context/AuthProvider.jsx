import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [token, setToken] = useState(localStorage.getItem("site") || "");
  const navigate = useNavigate();

  const loginAction = async (data) => {
    try {
      const response = await axios.post("https://backendsistemasalao.onrender.com/login", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const res = response.data;

      if (res.token) {
        setToken(res.token);
        localStorage.setItem("site", res.token);

        // Update user data directly from the login response
        setUser(res.userData); // Set user data from login response

        navigate("/"); // Redirects after successful login
      } else {
        throw new Error(res.message || "Login failed");
      }
    } catch (err) {
      console.error("Login failed:", err.message);
      setError(err.message); // Display error in the form
    }
  };

  const logOut = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("site");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, user, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};