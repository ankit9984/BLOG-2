import express from 'express';
import dotenv from 'dotenv'


import connectDB from './db/mongoDB.js';
import userRoutes from './routes/auth.routes.js'
import cookieParser from 'cookie-parser';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;
connectDB();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('hey')
});

app.use('/api/auth', userRoutes)

app.listen(PORT, () => {
    console.log(`port is running on ${PORT}`);
});