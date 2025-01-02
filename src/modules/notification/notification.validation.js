import joi from "joi";

export const notificationValidationSchema = {
  body: joi.object({
    receiver: joi.string().required().messages({
      "any.required": "Receiver ID is required",
    }),
    sender: joi.string().required().messages({
      "any.required": "Sender ID is required",
    }),
    type: joi
      .string()
      .valid("like", "comment", "follow", "newPost")
      .required()
      .messages({
        "any.required": "Notification type is required",
        "any.only": "Invalid notification type",
      }),
    post: joi.string().optional(),
    content: joi.string().optional(),
  }),
};

 