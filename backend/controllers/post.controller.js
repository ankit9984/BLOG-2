import { v2 as cloudinary } from "cloudinary";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

const createPost = async (req, res) => {
    try {
        const {title, content, img, status} = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({error: 'User not found'})
        };

        if(!title || !content){
            return res.status(400).json({error: 'Post must have title or content'})
        };

        // Handle image upload using Cloudinary

        let imgUrl;
        if(img){
            try {
                const uploadedResponse = await cloudinary.uploader.upload(img)
                imgUrl = uploadedResponse.secure_url;
            } catch (error) {
                console.error('Error uploading image to Cloudinary:', err);
                return res.status(500).json({ message: 'Internal server error (image upload)' });
            }
        }

        const newPost = new Post({
            title,
            content,
            img: imgUrl,
            author: userId,
            status
        });
        
        user.posts.push(newPost._id);
        await user.save();

        const savePost = await newPost.save();
        res.status(201).json(savePost)
    } catch (error) {
        console.log('Error in createPost controllers: ', error);
        res.status(500).json('Internal server error')
    }
};

const updatePost = async (req, res) => {
    try {
        const {title, content, img} = req.body
        const postId = req.params.id;
        const userId = req.user._id.toString();

        const post = await Post.findById(postId);

        if(!postId){
            return res.status(404).json({error: 'Post not found'})
        }

        if(post.author.toString() !== userId){
            return res.status(403).json({error: 'Forbidden action'})
        }

        let updatedPost = {title, content};

        if(img){
            try {
                const uploadedResponse = await cloudinary.uploader.upload(img);
                updatePost.img = uploadedResponse.secure_url;
            } catch (error) {
                onsole.error('Error uploading image to Cloudinary:', error);
                return res.status(500).json({ message: 'Internal server error (image upload)' });
            }
        };

        const newUpdatePost = await Post.findByIdAndUpdate(postId, updatedPost, {new: true})

        res.status(200).json(newUpdatePost)
    } catch (error) {
        console.log('Error in updatePost controllers: ', error);
        res.status(500).json('Internal server error');
    }
}

const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id.toString();

        const post = await Post.findById(postId);

        if(!post){
            return res.status(403).json({error: 'Post not found'})
        };

        if(post.author.toString() !== userId){
            return res.status(403).json({error: 'Forbidden action'})
        }
        
        await Post.findByIdAndDelete(postId);

        // const user = await User.findById(userId);
        // user.posts = user.posts.filter((id) => id.toString() !== postId);
        // await user.save();

        await User.findByIdAndUpdate(userId, {$pull: {posts: postId}});

        res.status(200).json({message: 'Post deleted'});
    } catch (error) {
        console.log('Error in deletePost controllers: ', error);
        res.status(500).json('Internal server errro')
    }
}


export {
    createPost,
    updatePost,
    deletePost
}