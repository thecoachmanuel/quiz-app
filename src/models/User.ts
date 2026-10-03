import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  first_name?: string;
  last_name?: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  avatar?: string;
  coins: number;
  balance: number;
  status: "active" | "banned";
  roles: string[];
  is_kyc_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

const UserSchema = new Schema<IUser>(
  {
    first_name: { type: String, default: "" },
    last_name: { type: String, default: "" },
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String },
    phone: { type: String, default: "" },
    avatar: { type: String, default: "" },
    coins: { type: Number, default: 100 },
    balance: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "banned"], default: "active" },
    roles: { type: [String], default: ["user"] },
    is_kyc_verified: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export const UserModel = User;
export default User;
