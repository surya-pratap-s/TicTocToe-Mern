import { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Loading from "./components/Loading";
import api from "./api/axiosInstance";

// Lazy-load pages
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Game = lazy(() => import("./pages/Game"));

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("auth_token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {

  const [serverReady, setServerReady] = useState(false);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await api.get("/");
        if (res.data.status === "Ok") {
          setServerReady(true);
        }
      } catch (err) {
        console.log("Server not ready... retrying");
        setTimeout(checkServer, 1000);
      }
    };

    checkServer();
  }, []);

  if (!serverReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
        <Loading />
        <p className="mt-4 text-sm text-gray-500">Connecting to server...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="mx-auto px-4 py-6">

        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={
              <PrivateRoute><Dashboard /></PrivateRoute>
            } />
            <Route path="/game" element={
              <PrivateRoute><Game /></PrivateRoute>
            } />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
