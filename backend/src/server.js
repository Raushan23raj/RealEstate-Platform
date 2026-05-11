import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import http from 'http'
import { Server } from 'socket.io'

import { connectDB } from './config/db.js';
import authRouter from './routes/authroutes.js';
import userRouter from './routes/userroutes.js';
import propertyRouter from './routes/propertyroutes.js';
import inquiryRouter from './routes/inquiryroutes.js';
import WhishlistRouter from './routes/whishlistroutes.js';
import contactRouter from './routes/contactroutes.js';
import adminRouter from './routes/adminroutes.js';
import chatRouter from './routes/chatroutes.js';

// if (!process.env.JWT_SECRET) {
//       throw new Error('JWT_SECRET environment variable is required');
// }

const app = express();

await connectDB();

//middlewares
const allowedOrigins = [
      "http://localhost:5173"
].filter(Boolean);

app.use(cors({
      origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                  callback(null, true);
            }
            else {
                  callback(new Error("Not allowed by CORS"))
            }
      },
      credentials: true
}));
app.use(express.json());

//routes
app.get('/api', (req, res) => {
      res.send('server is ready');
})

app.use('/api/auth', authRouter);

app.use("/api/user", userRouter);

app.use("/api/property", propertyRouter);

app.use("/api/inquiry", inquiryRouter);

app.use("/api/whishlist", WhishlistRouter);

app.use("/api/contact", contactRouter);

app.use("/api/admin", adminRouter);

app.use("/api/chat", chatRouter);

const httpServer = http.createServer(app);
//socket .io setup
const io = new Server(httpServer, {
      cors: {
            origin: allowedOrigins,
            methods: ["GET", "POST"],
      }
})

io.on("connection", (socket) => {
      socket.on("joinChat", (chatId) => {
            socket.join(chatId);
      })
      socket.on("sendMessage", (data) => {
            io.to(data.chatId).emit("receiveMessage", data);
      })
      socket.on("disconnect", () => { })
})


const PORT = process.env.PORT || 8000;

httpServer.listen(PORT, () => {
      console.log(`server is running on http://localhost:${PORT}`)
})