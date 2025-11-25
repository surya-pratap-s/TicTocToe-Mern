import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon, User, LogOut, Play, Grid, Menu, X, Home, HomeIcon } from "lucide-react";

export default function Navbar() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const [open, setOpen] = useState(false);

    const isAuthPage = ["/login", "/register"].includes(location.pathname);

    return (
        <header className="sticky top-0 z-30 backdrop-blur bg-white/70 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
            <nav className="mx-auto flex items-center justify-between px-4 py-3">

                {/* Left: brand */}
                <div className="flex items-center gap-3">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 text-white font-bold shadow-sm">
                            T3
                        </div>
                        <div className="hidden sm:block">
                            <div className="font-semibold text-slate-900 dark:text-slate-100">Tic-Tac-Toe</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Play with style</div>
                        </div>
                    </Link>
                </div>

                {/* Mobile menu button */}
                <button className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    onClick={() => setOpen((v) => !v)}
                    aria-expanded={open}
                    aria-label={open ? "Close menu" : "Open menu"}
                >
                    {open ? <X size={20} /> : <Menu size={20} />}
                </button>

                {/* Desktop / wide links */}
                <div className="hidden sm:flex items-center gap-3">
                    {user && !isAuthPage && (<>
                        <span className="hidden md:inline text-sm text-slate-500 dark:text-slate-400">
                            Hi, <span className="font-medium text-slate-800 dark:text-slate-100">{user.name}</span>
                        </span>

                        <Link to="/dashboard" className="inline-flex items-center gap-2 dark:text-white text-gray-400 hover:text-gray-100 rounded border border-gray-300 hover:border-gray-400 dark:border-slate-700 hover:dark:border-slate-500 p-1 text-sm bg-gray-200 hover:bg-gray-400 dark:bg-slate-800 hover:dark:bg-slate-600 shadow-sm hover:opacity-90 transition" title="Dashboard">
                            <HomeIcon size={16} />
                        </Link>

                        <Link to="/game" className="inline-flex items-center gap-2 dark:text-white text-gray-400 hover:text-gray-100 rounded border border-gray-300 hover:border-gray-400 dark:border-slate-700 hover:dark:border-slate-500 p-1 text-sm bg-gray-200 hover:bg-gray-400 dark:bg-slate-800 hover:dark:bg-slate-600 shadow-sm hover:opacity-90 transition" title="Play">
                            <Play size={16} />
                        </Link>

                        <button onClick={logout} className="inline-flex items-center gap-2 dark:text-white text-gray-400 hover:text-gray-100 rounded border border-gray-300 hover:border-gray-400 dark:border-slate-700 hover:dark:border-slate-500 p-1 text-sm bg-gray-200 hover:bg-gray-400 dark:bg-slate-800 hover:dark:bg-slate-600 shadow-sm hover:opacity-90 transition" title="Logout">
                            <LogOut size={16} />
                        </button>
                    </>
                    )}

                    {/* Not authenticated */}
                    {!user && (<>
                        <Link to="/login" className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200 hover:text-blue-700" >
                            <User size={16} /> Login
                        </Link>
                        <Link to="/register" className="text-sm text-slate-700 dark:text-slate-200 hover:text-blue-700">
                            Register
                        </Link>
                    </>)}

                    <button
                        onClick={toggleTheme}
                        title={theme === "dark" ? "Switch to light" : "Switch to dark"}
                        className="inline-flex items-center gap-2 dark:text-white text-gray-400 hover:text-gray-100 rounded border border-gray-300 hover:border-gray-400 dark:border-slate-700 hover:dark:border-slate-500 p-1 text-sm bg-gray-200 hover:bg-gray-400 dark:bg-slate-800 hover:dark:bg-slate-600 shadow-sm hover:opacity-90 transition"
                        aria-pressed={theme === "dark"}
                    >
                        {theme === "dark" ? (<Sun size={16} aria-hidden />) : (<Moon size={16} aria-hidden />)}
                    </button>
                </div>

                {/* Mobile: dropdown content */}
                {open && (
                    <div className="sm:hidden absolute left-0 right-0 top-full mt-1 px-4">
                        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-3">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Menu</div>
                                <button onClick={toggleTheme} className="inline-flex items-center gap-2 rounded-md px-2 py-1 border border-slate-200 dark:border-slate-700">
                                    {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                                </button>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Link to="/" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700">
                                    <Home size={16} /> Home
                                </Link>

                                {user && !isAuthPage ? (<>
                                    <div className="px-2 py-1 text-xs text-slate-500 dark:text-slate-400">
                                        Hi, <span className="font-medium text-slate-800 dark:text-slate-100">{user.name}</span>
                                    </div>

                                    <Link to="/dashboard" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700">
                                        <Grid size={16} /> Dashboard
                                    </Link>

                                    <Link to="/game" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700">
                                        <Play size={16} /> Play
                                    </Link>

                                    <button onClick={() => {
                                        logout();
                                        setOpen(false);
                                    }}
                                        className="flex items-center gap-2 text-left px-2 py-2 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40"
                                    >
                                        <LogOut size={16} /> Logout
                                    </button>
                                </>) : (<>
                                    <Link to="/login" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700">
                                        <User size={16} /> Login
                                    </Link>

                                    <Link to="/register" className="px-2 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700">
                                        Register
                                    </Link>
                                </>)}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
