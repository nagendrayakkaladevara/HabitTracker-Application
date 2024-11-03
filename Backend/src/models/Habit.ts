import mongoose, { Schema, Document } from 'mongoose';

interface IHabit extends Document {
    user: mongoose.Schema.Types.ObjectId;
    title: string;
    description?: string;
    startDate: Date;
    repeat: {
        type: string; // 'daily', 'weekly', 'custom'
        daysOfWeek?: string[]; // e.g., ['Monday', 'Wednesday']
    };
    completedDates: Date[]; // Track dates when the habit was completed
    time?: string; // Time taken for the habit
    productivityPercentage?: number; // Productivity percentage
}

const habitSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, default: Date.now },
    repeat: {
        type: { type: String, enum: ['daily', 'weekly', 'custom'], required: true },
        daysOfWeek: { type: [String], enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] }
    },
    completedDates: [{ type: Date }],
    time: { type: String }, // New field for time
    productivityPercentage: { type: Number, min: 0, max: 100 }, // New field for productivity percentage
});

const Habit = mongoose.model<IHabit>('Habit', habitSchema);

export default Habit;
export { IHabit };
