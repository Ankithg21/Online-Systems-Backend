import mongoose, {Schema} from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser{
    email: string;
    password: string;
    role: "user" | "admin";
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    }
}, {timestamps: true});

const User = mongoose.models?.User || mongoose.model<IUser>("User", userSchema);
export default User;