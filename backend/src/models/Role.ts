import mongoose, { Document, Model } from 'mongoose';

export interface IRole extends Document {
    name: string;
}

const roleSchema = new mongoose.Schema<IRole>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
});

const Role: Model<IRole> = mongoose.model<IRole>('Role', roleSchema);

export default Role;