import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/Auth_Model.js";

const generateAccessToken = (user) =>
{
    return jwt.sign(
        { _id: user._id, email: user.email, firstName: user.firstName },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "55m" }
    );
};

const generateRefreshToken = (user) =>
{
    return jwt.sign({ _id: user._id, email: user.email, firstName: user.firstName }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

// Store refresh tokens in memory or database
let refreshTokens = [];

// Register (Only Admins Can Register New Users)
const register = async (req, res) =>
{
    const { lastName, firstName, email, password, contactno } = req.body;

    try
    {
        const existingUser = await User.findOne({ email });
        if (existingUser)
        {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ lastName, firstName, email, password: hashedPassword, contactno });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error)
    {
        res.status(500).json({ error: "Database error" });
    }
};

// Login
const login = async (req, res) =>
{
    const { email, password } = req.body;

    try
    {
        const user = await User.findOne({ email });
        if (!user)
        {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
        {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const accessToken = generateAccessToken({ _id: user._id, email: user.email, firstName: user.firstName });
        const refreshToken = generateRefreshToken({ _id: user._id, email: user.email, firstName: user.firstName });
        const uid = user._id
        const uemail = user.email
        const uname = user.firstName



        res.json({ accessToken, refreshToken, uid, uemail, uname });
    } catch (error)
    {
        res.status(500).json({ error: "Database error" });
    }
};

// Refresh Token Endpoint
const refreshToken = (req, res) =>
{
    const { token } = req.body;
    if (!token) return res.status(401).json({ message: "Access denied" });

    if (!refreshTokens.includes(token))
    {
        return res.status(403).json({ message: "Invalid refresh token" });
    }

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) =>
    {
        if (err) return res.status(403).json({ message: "Invalid refresh token" });

        const accessToken = generateAccessToken({ _id: user._id, email: user.email, firstName: user.firstName });
        res.json({ accessToken });
    });
};

const logout = (req, res) =>
{
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer '))
    {
        return res.status(400).json({ message: 'Token missing from headers' });
    }

    const token = authHeader.split(' ')[1];
    refreshTokens = refreshTokens.filter((t) => t !== token);
    res.status(204).send();
};


const getUserDetails = async (req, res) =>
{
    try
    {
        const userId = req.user._id;
        //const userId = "67cbe9058b7109f1ca28bd04";

        const userdetails = await User.findById(userId);

        if (!userdetails)
        {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ userdetails });
    } catch (error)
    {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};


const deleteUser = async (req, res) =>
{
    try
    {
        const userId = req.user._id;

        if (userId !== userId && req.user.role !== "admin")
        {
            return res.status(403).json({ message: "You can only delete your own account" });
        }


        const user = await User.findByIdAndDelete(userId);
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error)
    {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
const getUserDetailsById = async (req, res) =>
{
    try
    {
        const { uid } = req.params; // Get uid from the route parameter
        const userdetails = await User.findById(uid); // Fetch user details by UID

        if (!userdetails)
        {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ userdetails });
    } catch (error)
    {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

const toggleFavorite = async (req, res) =>
{
    const userId = req.user._id;
    const { countryCode } = req.body;

    try
    {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const index = user.favorites.indexOf(countryCode);

        if (index > -1)
        {
            // Remove if already a favorite
            user.favorites.splice(index, 1);
        } else
        {
            // Add to favorites
            user.favorites.push(countryCode);
        }

        await user.save();
        res.status(200).json({ message: "Favorites updated", favorites: user.favorites });
    } catch (error)
    {
        res.status(500).json({ error: "Server error" });
    }
};


export { register, login, refreshToken, logout, getUserDetails, deleteUser, getUserDetailsById, toggleFavorite };
