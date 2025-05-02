import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

const Login = () =>
{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) =>
    {
        e.preventDefault();
        try
        {
            setLoading(true);
            const res = await API.post("/auth/login", { email, password });
            localStorage.setItem("accessToken", res.data.accessToken);
            localStorage.setItem("refreshToken", res.data.refreshToken);
            localStorage.setItem("uid", res.data.uid);
            navigate("/onboard");
        } catch (err)
        {
            setLoading(false);
            alert("Login failed");
        }
    };

    const toggleShowPassword = () =>
    {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-center">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-blue-100 text-sm">Sign in to continue your journey</p>
                    </div>

                    {/* Form Section */}
                    <form onSubmit={handleLogin} className="p-8 space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail size={18} className="text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="your.email@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock size={18} className="text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                />
                                <button
                                    type="button"
                                    onClick={toggleShowPassword}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} className="text-gray-500" />
                                    ) : (
                                        <Eye size={18} className="text-gray-500" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 shadow-md"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Signing in...
                                    </div>
                                ) : (
                                    "Sign In"
                                )}
                            </button>
                        </div>

                        <div className="flex items-center justify-between text-sm mt-6">
                            <div className="text-blue-600 hover:text-blue-800 transition cursor-pointer font-medium">
                                Forgot password?
                            </div>
                            <div className="text-blue-600 hover:text-blue-800 transition cursor-pointer font-medium" onClick={() => navigate("/register")}>
                                Create an account
                            </div>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="px-8 pb-6 text-center text-xs text-gray-500">
                        By signing in, you agree to our <span className="text-blue-600 hover:underline cursor-pointer">Terms of Service</span> and <span className="text-blue-600 hover:underline cursor-pointer">Privacy Policy</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;