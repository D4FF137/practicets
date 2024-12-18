interface Request {
    user?: {
        _id: string;
        username: string;
        roleID: string; // ObjectId роли
    };
}


export interface TokenPayload {
_id: string;
username: string;
roleID: string; // ObjectId роли
}

export interface IBooking extends Document {
    user: IUser['_id'];
    nomer: INomer['_id'];
    hostess: IUser['_id'];
    status: 'Pending' | 'Approved' | 'Rejected';
    createdAt: Date;
}

export interface INomer extends Document {
    uuidNomer: string;
    nameNomer: string;
    description: string;
    price:string;
}

export interface IPromotion extends Document {
    title: string; 
    description: string; 
    uploadDate: Date; 
    image: string; 
}

export interface IRole extends Document {
    name: string;
}

export interface IUser extends Document {
    username: string;
    email: string;
    phone: string;
    password: string;
    roleID: IRole['_id'];
}