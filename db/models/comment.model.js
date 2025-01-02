import mongoose, { Schema } from 'mongoose';

const replySchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
    comment: { type: String, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],  
  },
  { timestamps: true }
);

const commentSchema = new mongoose.Schema(
  {  
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },  
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },  
    comment: { type: String, required: true },
    replies: [replySchema],  
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }] 
  },
  { timestamps: true }
);

const commentModel = mongoose.model('Comment', commentSchema);

export default commentModel;
