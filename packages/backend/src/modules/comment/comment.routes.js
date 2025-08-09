import express from 'express'
import * as CC from './comment.controller.js'
import * as CV from './comment.validation.js'
import { validation } from '../../../middlewares/validation.js'
import { auth } from '../../../middlewares/auth.js'
import { systemRoles } from '../../../helpers/systemRoles.js'
const router = express.Router({ mergeParams: true })


// create Comment
router.post(
  '/:postId/add',
  auth(systemRoles.user),
  validation(CV.createCommentValidationSchema),
  CC.createComment
)

// Edit Comment
router.put(
  '/:postId/edit/:commentId',
  auth(systemRoles.user),
  validation(CV.editCommentValidationSchema),
  CC.updateComment
)

// delete Comment 
router.delete(
  '/:postId/:commentId',
  auth(systemRoles.user),
  validation(CV.deleteCommentValidationSchema),
  CC.deleteComment
);


// Get Comments for a Post
router.get(
  '/:postId',
  auth(systemRoles.user), 
  validation(CV.getCommentsValidationSchema), 
  CC.getComments
);

// Reply to a Comment
router.post(
  "/:postId/:commentId/reply",
  auth(systemRoles.user),
  validation(CV.replyToCommentValidationSchema),
  CC.replyToComment
);


// Like or Unlike a Comment
router.patch(
  "/:postId/:commentId/like",
  auth(systemRoles.user),
  validation(CV.likeCommentValidationSchema),
  CC.likeComment
);


  


export default router
