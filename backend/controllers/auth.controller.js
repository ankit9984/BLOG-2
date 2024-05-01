import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

const signup = async (req, res) => {
    try {
        const {username, fullName, password, email} = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(email)){
            return res.status(400).json({error: 'Invalid email formate'})
        };

        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(400).json({error: 'Username is already exist'})
        };

        const existingEmail = await User.findOne({email});
        if(existingEmail){
            return res.status(400).json({error: 'Email is already exist'})
        };

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            fullName,
            email,
            password: hashPassword
        });
        
        if(newUser){
            generateTokenAndSetCookie(newUser._id, res)

            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg
            })
        }else{
            res.status(400).json({error: 'Invalid user data'})
        }
    } catch (error) {
        console.log('Error in signup controllers', error);
        res.status(500).json({error: 'Internal Server Error'})
    }
};

const login = async (req, res) => {
    try {
        const {username, password} = req.body;

        const user = await User.findOne({username});

        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        

        if(!isPasswordCorrect){
            return res.status(400).json({error: 'Invalid username or password'})
        };

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            profileImg: user.profileImg,
            coverImg: user.coverImg
        })
    } catch (error) {
        console.log('Error in Login controllers: ', error);
        res.status(500).json({error: 'Internal server errro'})
    }
}

const logout = async (req, res) => {
    try {
        console.log(res);
        res.clearCookie('jwt');
        res.status(200).json({message: 'Logged out successfully'})
    } catch (error) {
        console.log("Error in logout controllers", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getProfile = async (req, res) => {
    const userId = req.user;
    try {
        const user = await User.findById(userId._id).select('-password').populate('posts');
        res.status(200).json(user)
    } catch (error) {
        console.log("Error in getMe controllers", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export {
    signup,
    login,
    logout,
    getProfile
}