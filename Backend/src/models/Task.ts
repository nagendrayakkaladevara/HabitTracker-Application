import mongoose, { Schema, Document } from 'mongoose';

interface ITask extends Document {
    title: string;
    description: string;
    priority: 'High' | 'Medium' | 'Low';
    dueDate: Date;
    status: 'Pending' | 'Completed';
    subtasks: mongoose.Schema.Types.ObjectId[];
    category: string;
    sharedWith: mongoose.Schema.Types.ObjectId[];
    recurring: boolean;
    email: string; // New field for user's email
}

const taskSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    dueDate: Date,
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
    subtasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    category: String,
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    recurring: { type: Boolean, default: false },
    email: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model<ITask>('Task', taskSchema);

export default Task;
export { ITask };