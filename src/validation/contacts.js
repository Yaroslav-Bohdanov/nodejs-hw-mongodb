import Joi from 'joi';
import { isValidObjectId } from 'mongoose';

export const addContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  phoneNumber: Joi.string().required(),
  email: Joi.string().email().required(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'personal').required(),
  userId: Joi.string()
    .custom((value, helper) => {
      if (!isValidObjectId(value)) {
        return helper.message('userId must be a valid MongoDB ObjectId');
      }
      return true;
    })
    .optional(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  phoneNumber: Joi.string(),
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'personal'),
}).min(1);
