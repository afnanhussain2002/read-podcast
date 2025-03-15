import mongoose from "mongoose";
import bcrypt from "bcryptjs";


export interface IUser {
    email: string;
    password: string;
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
  }

