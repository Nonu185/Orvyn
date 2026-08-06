import express from "express";
import CookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js"
import morgan from "morgan";
import cors from "cors";
import chatRouter from "./routes/chat.route.js";
const app = express();


//middleweares
app.use(cors(
    {
        origin:"http://localhost:5173",
        credentials:true,
        methods:["GET","POST","PUT","DELETE"],
    }
));
app.use(morgan("dev"));
app.use(express.json())
app.use(CookieParser())

app.use("/api/auth",authRouter);
app.use("/api/chats",chatRouter);

export default app;