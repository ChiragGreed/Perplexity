import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: [true, 'Username already exists'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Email already registered'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password'))
      this.password = await bcrypt.hash(this.password, 10);
  } catch (error) {
    next(error);
  }
});

const userModel = mongoose.model('User', userSchema);
export default userModel;
