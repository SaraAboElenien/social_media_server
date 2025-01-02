import mongoose, { Schema } from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },  
    firstName:  { type: Schema.Types.ObjectId, ref: "User" },  
    lastName:  { type: Schema.Types.ObjectId, ref: "User" },  
    profileImage: { type: Schema.Types.ObjectId, ref: "User" },
    description: { type: String, required: true },
    tags: [{ type: String }], 
    location: { type: String },
    // image: { type: String },
    image: 
    {
      secure_url: String, 
      public_id: String,
    },
    customId: String,
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],  
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }] 
  },
  { timestamps: true }
);

const postModel = mongoose.model("Post", postSchema);

export default postModel;
