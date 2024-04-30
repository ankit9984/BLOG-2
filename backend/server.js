import express from 'express';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import {v2 as cloudinary} from 'cloudinary'



import connectDB from './db/mongoDB.js';
import userRoutes from './routes/auth.routes.js'
import postRoutes from './routes/post.routes.js'

const app = express();
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const PORT = process.env.PORT || 5000;
connectDB();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('hey')
});

app.use('/api/auth', userRoutes);
app.use('/api/posts', postRoutes)

app.listen(PORT, () => {
    console.log(`port is running on ${PORT}`);
});