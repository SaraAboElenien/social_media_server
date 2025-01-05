import express from "express";
import * as PC from "./post.controller.js";
import * as PV from "./post.validation.js";
import { validation } from "../../../middlewares/validation.js";
import { auth } from "../../../middlewares/auth.js";
import { systemRoles } from "../../../helpers/systemRoles.js";
import {uploadImageToCloudinary} from '../../../middlewares/handleUploads.js'

const router = express.Router();
// create post
router.post(
  "/create-post",
  auth(systemRoles.user),
  uploadImageToCloudinary,
  validation(PV.createPostValidationSchema),
  PC.createPost
);

// update post
router.put(
  "/:id",
  auth(systemRoles.user),
  uploadImageToCloudinary,
  validation(PV.updatePostValidationSchema),
  PC.updatePost
);

// delete post
router.delete(
  "/:id",
  auth(systemRoles.user),
  validation(PV.deletePostValidationSchema),
  PC.deletePost
);

// user's posts
router.get(
  "/user-post/:userId",
  validation(PV.userPostValidationSchema),
  auth(systemRoles.user),
  PC.getUserPosts
);

// get posts
router.get("/recent-post", auth(systemRoles.user), PC.getRecentPosts);
router.get("/saved-posts", auth(systemRoles.user), PC.getSavedPosts);
router.get("/:id", auth(systemRoles.user), PC.getSpecificPost);
router.put("/:id/like", auth(systemRoles.user), PC.likePost);
router.put("/:postId/save", auth(systemRoles.user), PC.savePost);
router.delete("/:postId/save", auth(systemRoles.user), PC.deleteSavedPost);
router.get("/user/:id/liked", auth(systemRoles.user), PC.getLikedPosts);


export default router;
  