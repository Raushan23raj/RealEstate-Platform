import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../config";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";


const AuthContext = createContext();

export const AuthPorvider = ({ children }) => {
      const [token, setToken] = useState(
            localStorage.getItem("token") || sessionStorage.getItem("token") || null
      );
      const [user, setUser] = useState(
            (() => {
                  const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
                  return storedUser ? JSON.parse(storedUser) : null;
            })()
      );
      const [loading, setLoading] = useState(true);
      const navigate = useNavigate();

      useEffect(() => {
            if (token) {
                  const storedUser =
                        localStorage.getItem("user") || sessionStorage.getItem("user");
                  if (storedUser) {
                        setUser(JSON.parse(storedUser));
                  }
            }
            const interceptor = axios.interceptors.response.use(
                  (response) => response,
                  (error) => {
                        if (
                              error.response &&
                              error.response.status === 403 &&
                              error.response.data?.message?.includes("blocked")
                        ) {
                              logout();
                        }
                        return Promise.reject(error);
                  }
            )
            return () => axios.interceptors.response.eject(interceptor);
      }, [token]);

      //login

      const login = async (email, password, rememberMe = true) => {

            try {

                  setLoading(true);

                  const response = await axios.post(
                        `${API_URL}/api/auth/login`,
                        {
                              email,
                              password
                        }
                  );

                  const data = response.data;

                  // token and user from backend
                  const user = data.user;
                  const Token = data.token;

                  setUser(user);
                  setToken(Token);

                  // save data
                  if (rememberMe) {

                        localStorage.setItem("token", Token);
                        localStorage.setItem("user", JSON.stringify(user));

                  } else {

                        sessionStorage.setItem("token", Token);
                        sessionStorage.setItem("user", JSON.stringify(user));

                  }

                  navigate("/");

                  return {
                        success: true,
                        message: "Login successful"
                  };

            } catch (error) {

                  return {
                        success: false,
                        message:
                              error.response?.data?.message ||
                              "Login failed"
                  };

            } finally {
                  setLoading(false);
            }
      };
      // register user
      const register = async (userData) => {
            try {
                  const res = await axios.post(`${API_URL}/api/auth/registeruser`, userData);
                  return {
                        success: true,
                        message: res.data.message
                  }

            } catch (error) {
                  return {
                        success: false,
                        message:
                              error.response?.data?.message ||
                              "Registration failed"
                  };
            }
      }
      // tologout

      const logout = () => {
            setToken(null);
            setUser(null);
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");

            navigate("/login");
      }

      //to get user deatails
      const refreshUser = async () => {
            if (!token) {
                  return;
            }
            try {
                  const res = await axios.get(`${API_URL}/api/auth/me`, {
                        headers: { Authorization: `Bearer ${token}` }
                  })
                  if (res.data.success) {
                        const updatedUser = res.data.user;
                        setUser(updatedUser);
                        const storage = localStorage.getItem("token") ? localStorage : sessionStorage;
                        storage.setItem("user", JSON.stringify(updatedUser));
                  }


            } catch (error) {
                  console.error("Failed to refresh the user:", error)
            }

      }

      return <AuthContext.Provider
            value={{
                  user,
                  setUser,
                  token,
                  loading,
                  login,
                  register,
                  logout,
                  refreshUser,
            }}
      >
            {children}
      </AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);