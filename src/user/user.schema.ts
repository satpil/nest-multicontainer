import mongoose, { HydratedDocument } from 'mongoose';
import { UserDTO } from './user.service';

export type userDocument = HydratedDocument<UserDTO>;

export const usersSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
    required: true,
  },
});
