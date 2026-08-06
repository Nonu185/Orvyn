import "dotenv/config";
import app from "./src/app.js"
import connectDB from "./src/config/database.js"
import http from "http";
import { initializeSocket } from "./src/sockets/socketserver.js";

connectDB();

const server = http.createServer(app);
initializeSocket(server);

server.listen(process.env.PORT,()=>{
    console.log(`App is running on port ${process.env.PORT}`);
})
