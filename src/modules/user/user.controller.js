import bcryptjs from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken';
import userModel from '../../../db/models/user.model.js';
import { sendEmail } from '../../../helpers/sendEmail.js';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { asyncHandler } from '../../../helpers/globleErrorHandling.js';
import { AppError } from '../../../helpers/classError.js';
import path from 'path'
import fs from 'fs';
import notificationModel from '../../../db/models/notification.model.js';
import cloudinary from '../../../helpers/cloudinary.js';
const { compare, hash } = bcryptjs;
const { sign } = jsonwebtoken;


//========== Sign up ===========//
export const signUp = asyncHandler(async (req, res, next) => {

    const { firstName, lastName, email, password } = req.body;
    const userExist = await userModel.findOne({ email: email.toLowerCase() });
    if (userExist) {
        return res.status(409).json({ message: "This email is already registered!, please use another email!" });
    } else {

        const token = jwt.sign({ email }, process.env.confirmationKey, { expiresIn: 60 * 2 })
        const confirmationLink = `${req.protocol}://${req.headers.host}/api/v1/auth/user/confirmEmail/${token}`

        const refreshToken = jwt.sign({ email }, process.env.confirmationKeyRefresher)
        const confirmationLinkRefresher = `${req.protocol}://${req.headers.host}/api/v1/auth/user/confirmEmailRefresher/${refreshToken}`



        const checkEmail = await sendEmail(email, "Confirm email address", `<a href='${confirmationLink}'> Confirm your email</a> <br>
          <a href='${confirmationLinkRefresher}'> Click to resend the link</a>  `)
        if (!checkEmail) {
            next(new AppError("Failed to send email", 409))
        }
        const hashedPassword = await hash(password, parseInt(process.env.saltRounds));
        const newUser = {
            firstName,
            lastName,
            email,
            password: hashedPassword,
        };

        await userModel.create(newUser);
        newUser ? res.status(201).json({ message: "Congrats! You're registered", newUser }) : next(new AppError("Failed to register!", 500));
    }
})

//======== Email confirmation ==========//
export const confirmEmail = async (req, res, next) => {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.confirmationKey);
    if (!decoded?.email) {
        return next(new AppError("Invalid payload", 400))
    }
    const user = await userModel.findOneAndUpdate({ email: decoded.email, confirmed: false }, { confirmed: true }, { new: true });
    if (!user) {
        return next(new AppError("Your email is already confirmed", 400))
    }
    res.status(200).json({ message: "Your Email got confirmed <3"});
};


//======== Email confirmation refresher==========//
export const refreshConfirmation = async (req, res, next) => {
    const { refreshToken } = req.params;
    const decoded = jwt.verify(refreshToken, process.env.confirmationKeyRefresher);
    if (!decoded?.email) {
        return next(new AppError("Invalid payload", 400))
    }
    const user = await userModel.findOne({ email: decoded.email, confirmed: true });
    if (user) {
        return next(new AppError("Your email is already confirmed", 400))
    }

    const token = jwt.sign({ email: decoded.email }, process.env.confirmationKey)
    const confirmationLink = `${req.protocol}://${req.headers.host}/api/v1/auth/user/confirmEmail/${token}`

    await sendEmail(decoded.email, "Confirm email address", `<a href='${confirmationLink}'> Confirm your email</a>`)
    res.status(200).json({ message: "Your Email got confirmed <3", user });
};


//======== forget password =========//
export const forgetPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return next(new AppError("User not valid!", 400))
    }
    const code = nanoid(5);
    await sendEmail(email, "Job search app ", `<h1>Here is your code:${code}</h1>`);
    await userModel.updateOne({ email }, { code });
    res.status(200).json({ message: 'Please check your email for the link..' });
})

//=========== Reset password =========//
export const resetPassword = asyncHandler(async (req, res, next) => {
    const { email, code, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return next(new AppError("User not valid!", 400))
    }
    if (user.code !== code) {
        return next(new AppError("Invalid code!", 400))
    }
    const hashedPassword = await hash(password, parseInt(process.env.saltRounds));
    await userModel.updateOne({ email }, { password: hashedPassword, code: "", passwordChangedAt: Date.now() })
    res.status(200).json({ message: 'Your password successfully updated.' });
})




//============ sign in =============//
export const signIn = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email.toLowerCase(), confirmed: true });

    if (!user) {
        return next(new AppError("Invalid email or password", 401));
    }

    // Compare password
    if (!await compare(password, user.password)) {
        return next(new AppError("Invalid email or password", 401));
    }

    const token = sign({ id: user._id, email, role: user.role }, process.env.confirmationKey);
    user.loggedIn = 'true';
    await user.save();

    res.json({
        message: "Signin successful",
        token,
        // This is for the frontend response..
        user: {
            id: user._id,
            email: user.email,
            name: user.name,
            // Add other necessary fields
        },
    });
});


//=========== List all users with count ============//
export const listUsers = asyncHandler(async (req, res, next) => {
    const users = await userModel.find({}, 'firstName lastName username email profileImage createdAt updatedAt');
    const userCount = await userModel.countDocuments();

    res.status(200).json({
        message: 'User list retrieved successfully',
        userCount,
        users
    });
});





//=========== Get User By ID ============//
// This is the user Profile //
export const userByID = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    console.log('Received ID:', id); 
    const user = await userModel.findById(id).select('-password');
    if (!user) {
        return next(new AppError("Could not retrieve user!", 400)); 
    }
    res.status(200).json(user); 
    console.log('User found:', user);
});


   


//=========== Read User Details ============//
export const read = (req, res) => {
    const { user } = req; 
    const { password,confirmed,loggedIn,role, ...userDetails } = user.toObject(); 
    res.status(200).json({ message: 'User details retrieved successfully', user: userDetails });
};



//=========== Update User Profile ============//
export const updateAccount = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const { firstName, lastName, email, bio } = req.body;

  const updatedData = {};

  if (firstName) updatedData.firstName = firstName;
  if (lastName) updatedData.lastName = lastName;
  if (bio) updatedData.bio = bio;


  if (req.uploadedImage) {
    try {
      if (user.profileImage?.public_id) {
        await cloudinary.uploader.destroy(user.profileImage.public_id);
      }

      const { secure_url, public_id } = req.uploadedImage;
      user.profileImage = { secure_url, public_id };
    } catch (error) {
      return next(new AppError(`Error updating profile image: ${error.message}`, 500));
    }
  }

  const updatedUser = await user.save();
  if (!updatedUser) {
    return next(new AppError("Failed to update user profile", 500));
  }
  try {
    const updatedUser = await userModel.findByIdAndUpdate(user._id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return next(new AppError('User not found!', 404));
    }

    const { password, confirmed, loggedIn, role, ...userDetails } = updatedUser.toObject();

    res.status(200).json({
      message: 'Your account updated successfully <3',
      user: userDetails,
    });
  } catch (error) {
    return next(new AppError('Failed to update user profile. Please try again.', 500));
  }
});


//=========== Delete User Account ============//
export const deleteAccount = asyncHandler(async (req, res, next) => {
    const user = req.user;
    const deletedUser = await userModel.findByIdAndDelete(user._id);
    if (!deletedUser) {
        return next(new AppError("User not found!", 404));
    }
    res.status(200).json({ message: "Your account has been deleted successfully." });
});



//=========== Follow/Unfollow a User ============//
export const followUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params; 
    const userId = req.user.id;
    const { action } = req.body; 
  
    try {
      const currentUser = await userModel.findById(userId);
      const targetUser = await userModel.findById(id);
  
      if (!currentUser || !targetUser) {
        return next(new AppError("One or both users not found", 404));
      }
  
      if (action === "follow") {
        if (currentUser.following.includes(id)) {
          return res.status(400).json({ message: "Already following this user." });
        }
        currentUser.following.push(id);
        targetUser.followers.push(userId);
  
        if (userId !== id) {
          await notificationModel.create({
            receiver: id,
            sender: userId,
            type: "follow",
            content: `started following you.`,
          });
        }
      } else if (action === "unfollow") {
        if (!currentUser.following.includes(id)) {
          return res.status(400).json({ message: "You are not following this user." });
        }
        currentUser.following.pull(id);
        targetUser.followers.pull(userId);
      } else {
        return res.status(400).json({ message: "Invalid action specified" });
      }
  
      await currentUser.save();
      await targetUser.save();
  
      res.status(200).json({
        message: `User successfully ${action === "follow" ? "followed" : "unfollowed"}!`,
        followersCount: targetUser.followers.length,
      });
    } catch (error) {
      console.error("Error updating follow status:", error);
      res.status(500).json({
        message: "error",
        err: "Error updating follow status",
      });
    }
  });
  

// export const getByRecoveryEmail = asyncHandler(async (req, res, next) => {
//     const { recoveryEmail } = req.query;
//     if (!recoveryEmail) {
//         return next( new AppError ("Recovery email is required!", 400))
//     }
//     const users = await userModel.find({ recoveryEmail }).select('-password');
//     if (users.length === 0) {
//         return next( new AppError ("No users found with the provided recovery email!", 404))
//     }
//     res.status(200).json({ message: 'Done', users });

// })


//========= update password =========//
// export const updatePassword = asyncHandler( async (req, res) => {
//     const { oldPassword, newPassword } = req.body;
//     if (!oldPassword || !newPassword) {
//         return next( new AppError ("Old password and new password are required!!", 400))
//     }
//         const user = await userModel.findById(req.user._id);
//         if (!user) {
//             return next( new AppError ("User not found", 400))
//         }
//         const isMatch = await bcrypt.compare(oldPassword, user.password);
//         if (!isMatch) {
//             return next( new AppError ("Incorrect old password", 401))
//         }
//         user.password = newPassword;
//         await user.save();
//         res.send({ message: 'Password updated successfully' });
// })



// =========== Profile ============//
export const getProfile = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user.id).select('-password');  
    if (!user) {
        return next(new AppError("Could not retrieve user profile!", 400));
    }
    res.status(200).json({ message: 'User profile fetched successfully', user });
});
