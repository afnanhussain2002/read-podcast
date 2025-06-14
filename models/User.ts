import mongoose, { model, models, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  email: string;
  password?: string;
  _id?: mongoose.Types.ObjectId;
  profileImage?: string;
  transcriptMinutes: number;
  resetToken?: string;
  resetTokenExpiry?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false  },
    profileImage: { type: String, required: false },
    transcriptMinutes: { type: Number, default: 10 },
    resetToken: { type: String, required: false, default: undefined },
    resetTokenExpiry: { type: Date, required: false, default: undefined },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = models?.User || model<IUser>("User", userSchema);

export default User;
