import User from '../models/userModels.js';
import Post from '../models/postModel.js';
import {v2 as cloudinary} from "cloudinary";    

const createPost = async (req, res) => {
	try {
		const { postedBy, text } = req.body;
		let { img } = req.body;

		if (!postedBy || !text) {
			return res.status(400).json({ error: "Postedby and text fields are required" });
		}

		const user = await User.findById(postedBy);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		if (user._id.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Unauthorized to create post" });
		}

		const maxLength = 500;
		if (text.length > maxLength) {
			return res.status(400).json({ error: `Text must be less than ${maxLength} characters` });
		}

		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

		const newPost = new Post({ postedBy, text, img });
		await newPost.save();

		res.status(201).json(newPost);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log(err);
	}
};

const getPost = async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({error: "Post not found"});
        }
        res.status(200).json({message: "Post Found ",post})
    }catch(err){
        res.status(500).json({error: "Server Error"});
        console.error("Error in getting post: ",err.message);
    }
}

const deletePost = async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({error: "Post not found"});
        }
        if(post.postedBy.toString()!== req.user._id.toString()){
            return res.status(401).json({error: "Unauthorized to delete this post"});
        }
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "Post deleted successfully"});
    }catch(err){
        res.status(500).json({error: "Server Error"});
        console.error("Error in deleting post: ",err.message);
    }
}

const likeUnlikePost = async (req, res) => {
    try{
        const {id:postId} = req.params //here id:postId is converting name of id to postId
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({error: "Post not found"});
        }
        const isLike = post.likes.includes(userId);
        if(isLike){
            //unlike
            await Post.updateOne({_id: postId}, {$pull: {likes: userId}});
            res.status(200).json({message: "Post unliked successfully"});
        }else{
            post.likes.push(userId);
            await post.save();
            res.status(200).json({message: "Post liked successfully"});
        }
    }catch(err){
        res.status(500).json({error: "Server Error"});
        console.error("Error in liking/unliking post: ",err.message);
    }
}

const replyToPost = async (req, res) => {
    try{
        const {id:postId} = req.params;
        const {text} = req.body;
        const userId = req.user._id;
        const post = await Post.findById(postId);
        const userProfilePic = req.user.profilePic;
        const username = req.user.username;
        if(!text){
            return res.status(400).json({error: "Please provide a valid reply"});
        }
        if(!post){
            return res.status(404).json({error: "Post not found"});
        }
        const maxLength = 500;
        if(text.length > maxLength){
            return res.status(400).json({error: `Text must be less than ${maxLength} characters`});
        }
        const newReply = {userId, username, userProfilePic, text};
        post.replies.push(newReply);
        await post.save();
        res.status(201).json({message: "Reply created successfully"});
    }catch(err){
        res.status(500).json({error: "Server Error"});
        console.error("Error in replying to post: ",err.message);
    }
}

const getFeed = async (req, res) => {
    try {
		const userId = req.user?._id;
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const following = user.following;

		const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });

		res.status(200).json(feedPosts);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};



export {createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeed}