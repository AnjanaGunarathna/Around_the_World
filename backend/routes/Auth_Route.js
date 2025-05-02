import express from "express";
import { register, login, refreshToken, logout, getUserDetails, deleteUser, getUserDetailsById, toggleFavorite } from "../controllers/Auth_Controller.js";
import { authenticateToken } from "../middleware/Authentication.js"
const Authrouter = express.Router();

Authrouter.post("/register", register);
Authrouter.post("/login", login);
Authrouter.post("/refresh", refreshToken);
Authrouter.post("/logout", logout);
Authrouter.get("/getuserdetails", authenticateToken, getUserDetails);
Authrouter.delete("/deluser", authenticateToken, deleteUser);
// New route for fetching user details by UID without token
Authrouter.get("/userdetails/:uid", getUserDetailsById);
Authrouter.post("/toggle-favorite", authenticateToken, toggleFavorite);


export default Authrouter;
