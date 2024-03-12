// mongoose schema for user
// intface User is located in src/interfaces/User.ts

import mongoose from 'mongoose';
import {User} from '../../types/DBTypes';

const userModel = new mongoose.Schema<User>({
  user_name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: null,
  },
});

// Duplicate the ID field.
userModel.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
userModel.set('toJSON', {
  virtuals: true,
});

export default mongoose.model<User>('User', userModel);
