import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import bodyParser from 'body-parser';
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/Auth_Route.js";



dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();



app.disable('x-powered-by'); // less hackers know about our stack

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(express.json()); // allows us to parse incoming requests:req.body
app.use(cookieParser()); // allows us to parse incoming cookies

app.use("/auth", authRoutes);




app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.listen(PORT, () =>
{
	connectDB();
	console.log("Server is running on port: ", PORT);
});
