import mongoose, { Document, Model } from "mongoose"

export interface IRole extends Document {
    roleID: number;
    roleName: string;
}

const roleSchema = new mongoose.Schema<IRole>({
    roleID:{                                                                                                                                                                                                                                                                
        type: Number,
        required: true,
        unique: true
    }
    ,
    roleName:{
        type: String,
        required: true,
        unique:true
    }
})

const Role: Model<IRole> = mongoose.model<IRole>('Role', roleSchema);

export default Role;