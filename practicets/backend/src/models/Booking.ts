import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./User";
import { INomer } from "./Nomer";

export interface IBooking extends Document {
    user: IUser['_id'];
    nomer: INomer['_id'];
    hostess: IUser['_id'];
    status: 'Pending' | 'Approved' | 'Rejected';
    createdAt: Date;
}

const bookingSchema = new mongoose.Schema<IBooking>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    nomer: {
        type: Schema.Types.ObjectId,
        ref: 'Nomer',
        required: true,
    },
    hostess: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Booking: Model<IBooking> = mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;