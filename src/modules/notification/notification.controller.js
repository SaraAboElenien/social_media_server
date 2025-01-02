import { asyncHandler } from '../../../helpers/globleErrorHandling.js'
import { AppError } from '../../../helpers/classError.js'
import notificationModel from '../../../db/models/notification.model.js'


// Create Notification
export const createNotification = asyncHandler(async (req, res, next) => {
  const { receiver, type, sender, post, content } = req.body;

  if (!receiver || !type || !sender) {
    return next(new AppError("Receiver, type, and sender are required", 400));
  }

  const notification = await notificationModel.create({
    receiver,
    sender,
    type,
    post,
    content,
  });

  res.status(201).json({
    message: "Notification created successfully",
    notification,
  });
});



// Get Notifications
export const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const notifications = await notificationModel
    .find({ receiver: userId })
    .populate("sender", "firstName lastName profileImage")
    .populate("post", "description image")
    .sort({ createdAt: -1 });

  res.status(200).json({
    notifications,
  });
});

// Mark as Read
export const markAsRead = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const notification = await notificationModel.findByIdAndUpdate(
    id,
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    return next(new AppError("Notification not found", 404));
  }

  res.status(200).json({
    message: "Notification marked as read",
    notification,
  });
});  
