import express, { json } from "express";
import { createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeed } from "../controllers/postController.js";
import protectRoute from "../middleware/protectRoute.js";

const router  = express.Router();

router.get('/feed',protectRoute,getFeed);
router.get('/:id', getPost);
router.post("/create",protectRoute, createPost);
router.delete("/:id",protectRoute, deletePost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/reply/:id", protectRoute, replyToPost);

export default router;
