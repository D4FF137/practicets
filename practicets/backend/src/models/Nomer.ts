import mongoose, { Document, Model } from "mongoose";
import {v4 as uuidv4} from 'uuid'

export interface INomer extends Document {
    uuidNomer: string;
    nameNomer: string;
}

const nomerSchema = new mongoose.Schema({
    uuidNomer: {
        type: String,
        default: uuidv4,
        unique: true
    },
    nameNomer: {
        type: String,
        required: true,
        unique: true
    }
});


const Nomer: Model<INomer> = mongoose.model<INomer>('Nomer', nomerSchema);

export default Nomer;