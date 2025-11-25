import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axiosInstance";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const token = localStorage.getItem("auth_token");
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const { data } = await api.get("/auth/me");
                setUser(data);
                console.log(user)
            } catch (err) {
                console.warn("Failed to fetch profile:", err);
                localStorage.removeItem("auth_token");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);


    const login = (data) => {
        if (data.token) {
            localStorage.setItem("auth_token", data.token);
            api.get("/auth/me")
                .then((res) => setUser(res.data))
                .catch(() => {
                    localStorage.removeItem("auth_token");
                    setUser(null);
                });
        }
    };


    const register = login;

    const logout = () => {
        localStorage.removeItem("auth_token");
        setUser(null);
    };

    const value = { user, login, register, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
