import PropTypes from "prop-types";
import axios from "axios";
import { createContext, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("site") || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loginAction = useCallback(async (data) => {
    setIsLoading(true);
    setError("");
    try {
      
      const response = await axios.post("https://backendsistemasalao-production.up.railway.app/login", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const res = response.data;

      if (res.token) {
        setToken(res.token);
        localStorage.setItem("site", res.token);
        setUser(res.userData);
        navigate("/");
      } else {
        throw new Error(res.message || "Login failed");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const logOut = useCallback(() => {
    setUser(null);
    setToken("");
    localStorage.removeItem("site");
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const validateToken = async () => {
      if (token) {
        try {
          const response = await axios.get("https://backendsistemasalao-production.up.railway.app/validation", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data.userData);
        } catch (err) {
          logOut();
        }
      }
    };

    validateToken();
  }, [token, logOut]);

  return (
    <AuthContext.Provider value={{ token, user, loginAction, logOut, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
export { AuthContext }; 
