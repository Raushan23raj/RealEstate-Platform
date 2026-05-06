import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/db.js';
import authRouter from './routes/authroutes.js';

const app = express();

await connectDB();

//middlewares
app.use(cors());
app.use(express.json());

//routes
app.get('/api', (req, res) => {
      res.send('server is ready');
})

app.use('/api/auth-routes', authRouter)



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
      console.log(`server is running on http://localhost:${PORT}`)
})