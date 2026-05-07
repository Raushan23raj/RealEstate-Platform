import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/db.js';
import authRouter from './routes/authroutes.js';
import userRouter from './routes/userroutes.js';
import propertyRouter from './routes/propertyroutes.js';
import inquiryRouter from './routes/inquiryroutes.js';

// if (!process.env.JWT_SECRET) {
//       throw new Error('JWT_SECRET environment variable is required');
// }

const app = express();

await connectDB();

//middlewares
app.use(cors());
app.use(express.json());

//routes
app.get('/api', (req, res) => {
      res.send('server is ready');
})

app.use('/api/auth', authRouter)

app.use("/api/user", userRouter)

app.use("/api/property", propertyRouter)

app.use("/api/inquiry", inquiryRouter)


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
      console.log(`server is running on http://localhost:${PORT}`)
})