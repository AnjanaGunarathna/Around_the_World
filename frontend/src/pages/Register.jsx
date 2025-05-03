import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";

const Register = () =>
{
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        contactno: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) =>
    {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) =>
    {
        e.preventDefault();
        try
        {
            setLoading(true);
            await API.post("/auth/register", form);
            setLoading(false);
            alert("User registered successfully!");
            navigate("/");
        } catch (err)
        {
            setLoading(false);
            alert("Registration failed");
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
                            Create Account
                        </h1>
                        <p className="text-blue-100 text-sm">Join us and start exploring the world</p>
                    </div>

                    {/* Form Section */}
                    <form onSubmit={handleRegister} className="p-8 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="firstName" className="text-sm font-medium text-gray-700 block">
                                    First Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        placeholder="John"
                                        value={form.firstName}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="lastName" className="text-sm font-medium text-gray-700 block">
                                    Last Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        placeholder="Doe"
                                        value={form.lastName}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                    />
                                </div>
                            </div>
                        </div>

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
                                    name="email"
                                    type="email"
                                    placeholder="your.email@example.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
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
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
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

                        <div className="space-y-2">
                            <label htmlFor="contactno" className="text-sm font-medium text-gray-700 block">
                                Contact Number
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone size={18} className="text-gray-400" />
                                </div>
                                <input
                                    id="contactno"
                                    name="contactno"
                                    placeholder="+1 (234) 567-8901"
                                    value={form.contactno}
                                    onChange={handleChange}
                                    className="w-full pl-10 p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 shadow-md"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Creating Account...
                                    </div>
                                ) : (
                                    "Create Account"
                                )}
                            </button>
                        </div>

                        <div className="text-center text-sm text-gray-600 pt-2">
                            Already have an account?{" "}
                            <span
                                className="text-blue-600 hover:text-blue-800 cursor-pointer transition font-medium"
                                onClick={() => navigate("/login")}
                            >
                                Sign in
                            </span>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="px-8 pb-6 text-center text-xs text-gray-500">
                        By creating an account, you agree to our <span className="text-blue-600 hover:underline cursor-pointer">Terms of Service</span> and <span className="text-blue-600 hover:underline cursor-pointer">Privacy Policy</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
