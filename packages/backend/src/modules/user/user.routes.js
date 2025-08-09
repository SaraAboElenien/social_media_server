import express from 'express';
import * as UC from './user.controller.js';
import { auth } from '../../../middlewares/auth.js';
import { validation } from '../../../middlewares/validation.js';
import * as UV from './user.validation.js';
const router = express.Router();
import { systemRoles } from '../../../helpers/systemRoles.js';
import { handleCloudinaryUpload } from "../../../helpers/multerLocal.js";
import { uploadImage } from "../../../helpers/multerLocal.js";


router.post('/signup', validation(UV.signupValidationSchema), UC.signUp);
router.get('/confirmEmail/:token', UC.confirmEmail);
router.get('/confirmEmailRefresher/:refreshToken', UC.refreshConfirmation);
router.patch('/forgetPassword', UC.forgetPassword);
router.patch('/resetPassword', UC.resetPassword);
router.post('/signin', validation(UV.signinValidationSchema), UC.signIn);
router.get('/list', UC.listUsers)
router.get('/userByID/:id',
    auth(systemRoles.user),
    UC.userByID);

    router.get('/profile',   
      auth(systemRoles.user),
      UC.getProfile);
  


    router.put('/:id/follow',
      auth(systemRoles.user),
      UC.followUser);
  


router.patch('/updateProfile',
    auth(systemRoles.user),
    uploadImage('profileImage'),
    handleCloudinaryUpload,
    UC.updateAccount);



router.delete('/deleteProfile',
    auth(systemRoles.user),
     UC.deleteAccount );
     


     
// router.get('/recoveryEmail', auth(), UC.getByRecoveryEmail );
// router.patch('/updatePassword',auth(),validation(UV.updatePasswordSchema), UC.updatePassword)


export default router