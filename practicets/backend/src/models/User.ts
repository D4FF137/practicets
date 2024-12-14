import mongoose, { Document, Model } from "mongoose";
import Booking from "./Booking";

export interface IUser extends Document {
    username: string;
    email: string;
    phone: string;
    password: string;
    roleID: number;
}

const userSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    roleID: {
        type: Number,
        required: true,
        ref: 'Role',
    },
});

userSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const user = this as IUser;
    await Booking.deleteMany({user: user._id});
    next();
});

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;