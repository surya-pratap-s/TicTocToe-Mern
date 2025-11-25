import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const { data } = await api.post("/auth/register", form);
            register(data);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <section className="mt-10 flex justify-center">
            <div className="w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-1">Register</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    Create an account to track your Tic-Tac-Toe tournaments.
                </p>

                {error && (
                    <p className="mb-3 text-xs text-red-500 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 px-3 py-2 rounded-lg">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="space-y-1 text-xs">
                        <label className="block text-slate-600 dark:text-slate-300">Name</label>
                        <input
                            name="name"
                            required
                            value={form.name}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/70"
                        />
                    </div>

                    <div className="space-y-1 text-xs">
                        <label className="block text-slate-600 dark:text-slate-300">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            value={form.email}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/70"
                        />
                    </div>

                    <div className="space-y-1 text-xs">
                        <label className="block text-slate-600 dark:text-slate-300">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            value={form.password}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/70"
                        />
                    </div>

                    <button type="submit" className="w-full rounded-full bg-emerald-500 hover:bg-emerald-600 text-xs font-semibold text-white py-2 mt-2 transition">
                        Register
                    </button>
                </form>

                <p className="mt-4 text-[11px] text-slate-500 dark:text-slate-400">
                    Already have an account?{"  "}
                    <Link to="/login" className="text-emerald-500 hover:text-emerald-400 font-medium">
                        Login
                    </Link>
                </p>
            </div>
        </section>
    );
}
