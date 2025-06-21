// import axios from "axios";
// import React, {
//   createContext,
//   ReactNode,
//   useContext,
//   useEffect,
//   useState,
// } from "react";
// import toast from "react-hot-toast";

// interface User {
//   id: string;
//   email: string;
//   name: string;
// }

// interface AuthContextType {
//   user: User | null;
//   login: (email: string, password: string) => Promise<boolean>;
//   register: (name: string, email: string, password: string) => Promise<boolean>;
//   logout: () => void;
//   authLoading: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [authLoading, setAuthLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//       verifyToken();
//     } else {
//       setAuthLoading(false);
//     }
//   }, []);

//   const verifyToken = async () => {
//     try {
//       const res = await axios.get("/api/auth/verify");
//       setUser(res.data.user);
//     } catch (err) {
//       localStorage.removeItem("token");
//       delete axios.defaults.headers.common["Authorization"];
//       setUser(null);
//     } finally {
//       setAuthLoading(false);
//     }
//   };

//   const login = async (email: string, password: string): Promise<boolean> => {
//     try {
//       const res = await axios.post("/api/auth/login", { email, password });
//       const { token, user } = res.data;
//       localStorage.setItem("token", token);
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//       setUser(user);
//       toast.success("Login successful!");
//       return true;
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Login failed");
//       return false;
//     }
//   };

//   const register = async (
//     name: string,
//     email: string,
//     password: string
//   ): Promise<boolean> => {
//     try {
//       const res = await axios.post("/api/auth/register", { name, email, password });
//       const { token, user } = res.data;
//       localStorage.setItem("token", token);
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//       setUser(user);
//       toast.success("Registration successful!");
//       return true;
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "Registration failed");
//       return false;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     delete axios.defaults.headers.common["Authorization"];
//     setUser(null);
//     toast.success("Logged out successfully");
//   };

//   return (
//     <AuthContext.Provider
//       value={{ user, login, register, logout, authLoading }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Configure axios base URL based on environment
  useEffect(() => {
    const baseURL =
      import.meta.env.VITE_API_URL ||
      (import.meta.env.PROD
        ? "https://fund-flow-backend.onrender.com"
        : "http://localhost:5000");

    axios.defaults.baseURL = baseURL;

    // Set up request interceptor for auth token
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      verifyToken();
    } else {
      setLoading(false);
    }

    // Add response interceptor to handle token expiration
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
          setUser(null);
          toast.error("Session expired. Please login again.");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const verifyToken = async () => {
    try {
      const response = await axios.get("/api/auth/verify");
      setUser(response.data.user);
    } catch (error: any) {
      console.error("Token verification failed:", error);
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await axios.post("/api/auth/login", { email, password });
      const { token, user: userData } = response.data;

      // Store token and set up axios headers
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Set user data
      setUser(userData);

      toast.success("Login successful!");
      return true;
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.";
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });
      const { token, user: userData } = response.data;

      // Store token and set up axios headers
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Set user data
      setUser(userData);

      toast.success("Registration successful!");
      return true;
    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Please try again.";
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    toast.success("Logged out successfully");
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};