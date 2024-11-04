import User from '../models/userModels.js'
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from '../utils/helper/generateTokenAndSetCookies.js';
import {v2 as cloudinary} from 'cloudinary';
const signupUser = async (req, res) => {
    try {
        const { name, email, username, password } = req.body;

        // Validate input
        if (!name || !email || !username || !password) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const user = await User.findOne({ $or: [{ email }, { username }] });

        if (user) {
            return res.status(400).json({ error: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            username,
            password: hashedPassword,
        });

        await newUser.save();

        // Generate token and set cookie
        generateTokenAndSetCookie(newUser._id, res);

        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            username: newUser.username,
            bio: newUser.bio,
            profilePic: newUser.profilePic,
        });
    } catch (err) {
        console.error("Error in signupUser: ", err); // Log full error
        res.status(500).json({ error: "Internal Server Error" }); // Ensure JSON response
    }
};



const loginUser = async (req, res) => {
	try {
	  const { username, password } = req.body;
	  
	  const user = await User.findOne({ username });
	  const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
  
	  // Return error if username or password is incorrect
	  if (!user || !isPasswordCorrect) {
		return res.status(400).json({ error: "Invalid username or password" });
	  }
  
	  // Unfreeze user account if it's frozen
	  if (user.isFrozen) {
		user.isFrozen = false;
		await user.save();
	  }
  
	  // Generate JWT token and set as cookie (helper function)
	  generateTokenAndSetCookie(user._id, res);
  
	  // Respond with user data
	  res.status(200).json({
		_id: user._id,
		name: user.name,
		email: user.email,
		username: user.username,
		bio: user.bio,
		profilePic: user.profilePic,
	  });
	} catch (error) {
	  console.log("Error in loginUser: ", error.message); // Log for debugging
	  // Always return an error message as a string to avoid sending objects
	  res.status(500).json({ error: error.message || "An error occurred" });
	}
  };
  

const logoutUser = (req, res)=>{
    try{
        res.cookie("jwt", "", {maxAge:1});
        res.status(200).json({msg: "Logged out"});
    }catch(err){
        res.status(500).json({msg: "Server Error"});
        console.error("Error in logout user: ",err.message);
    }
}

const followUnfollowUser = async (req, res)=>{
    try{
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if(id === req.user._id.toString()) return res.status(400).json({message: "you cannot follow/unfollow yourself"});

        if(!userToModify || !currentUser) return res.status(400).json({error: "User not found"});

        const isFollowing = currentUser.following.includes(id);
         
        if (isFollowing) {
			// Unfollow user
			await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
			res.status(200).json({ message: "User unfollowed successfully" });
		} else {
			// Follow user
			await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
			res.status(200).json({ message: "User followed successfully" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in followUnFollowUser: ", err.message);
	}
}

const updateUser = async (req, res) => {
	const { name, email, username, password, bio } = req.body;
	let { profilePic } = req.body;

	const userId = req.user._id;
	try {
		let user = await User.findById(userId);
		if (!user) return res.status(400).json({ error: "User not found" });

		if (req.params.id !== userId.toString())
			return res.status(400).json({ error: "You cannot update other user's profile" });

		if (password) {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			user.password = hashedPassword;
		}

		if (profilePic) {
			if (user.profilePic) {
				await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(profilePic);
			profilePic = uploadedResponse.secure_url;
		}

		user.name = name || user.name;
		user.email = email || user.email;
		user.username = username || user.username;
		user.profilePic = profilePic || user.profilePic;
		user.bio = bio || user.bio;

		user = await user.save();

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in updateUser: ", err.message);
	}
};

const getUserProfile = async (req, res) => {
	//we will fetch user profile either with username or userId
	const {query} = req.params;  //query is either username or userId
    try{
		let user;
		if(mongoose.Types.objectId.isValid(query)){
			user = await User.findOne({_id: query }).select("-password").select("-updateAt");
		}else{
			user = await User.findOne({username: query }).select("-password").select("-updateAt");
		}
        
        if(!user) res.status(200).json({error:" User not found"});

        res.status(200).json(user);

    }catch(err){
        res.status(500).json({msg: 'Server Error'});
        console.error("Error in get user profile: ",err.message);
    }
}

export {signupUser, loginUser, logoutUser, followUnfollowUser, updateUser, getUserProfile};