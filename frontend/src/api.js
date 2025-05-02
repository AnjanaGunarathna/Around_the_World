// src/api.js
import axios from "axios";

const API = axios.create({
    baseURL: "https://around-the-world-tt3t.onrender.com",
    withCredentials: true,
});

API.interceptors.request.use((config) =>
{
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default API;
