import mongoose, { Document, Model } from "mongoose";
import {v4 as uuidv4} from 'uuid'
import { number } from "zod";

export interface INomer extends Document {
    uuidNomer: string;
    nameNomer: string;
    description: string;
    price:string;
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
    },
    description: {
        type: String
    },
    price: {
        type:String,
        required:true
    },
    image: {
        type:String,
    }
});


const Nomer: Model<INomer> = mongoose.model<INomer>('Nomer', nomerSchema);

export default Nomer;