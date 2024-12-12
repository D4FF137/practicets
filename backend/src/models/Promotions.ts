import mongoose, { Schema, Document } from 'mongoose';

export interface IPromotion extends Document {
    title: string; 
    description: string; 
    uploadDate: Date; 
    image: string; 
}

const PromotionSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now },
    image: { type: String, required: true }, 
});

export default mongoose.model<IPromotion>('Promotion', PromotionSchema);