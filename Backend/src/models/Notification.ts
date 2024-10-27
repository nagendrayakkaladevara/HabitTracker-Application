import mongoose, { Schema, Document } from 'mongoose';

interface INotification extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    taskId: mongoose.Schema.Types.ObjectId;
    message: string;
    isRead: boolean;
}

const notificationSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model<INotification>('Notification', notificationSchema);

export default Notification;
export { INotification };
