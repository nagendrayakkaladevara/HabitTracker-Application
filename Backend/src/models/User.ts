import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    preferences: {
        theme: string;
        notificationsEnabled: boolean;
    };
    tasks: mongoose.Schema.Types.ObjectId[];
}

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    preferences: {
        theme: { type: String, default: 'light' },
        notificationsEnabled: { type: Boolean, default: true },
    },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
export { IUser };
