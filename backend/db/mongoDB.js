import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('MONGODB CONNECT SUCCESSFULLY'))
        .catch((error) => console.error('MongoDB: ', error));
    } catch (error) {
        console.log(error);
    }
};

export default connectDB;