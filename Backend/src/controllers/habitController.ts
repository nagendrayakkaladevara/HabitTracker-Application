import { Request, Response } from 'express';
import Habit from "../models/Habit";
import User from "../models/User";
import { calculateProductivityPercentage } from '../utiles/utiles';

export const createHabit = async (req: Request, res: Response) => {
    const { userId, title, description, repeat, time } = req.body;
    console.log("🚀 ~ createHabit ~ repeat:", repeat)

    try {
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return
        }

        const habit = new Habit({
            user: userId,
            title,
            description,
            repeat,
            time
        });

        await habit.save();
        res.status(201).json({ message: 'Habit created', habit });
    } catch (error) {
        res.status(500).json({ message: 'Error creating habit', error });
    }
};

export const getTodaysHabits = async (req: Request, res: Response) => {
    const { userId } = req.params;
    console.log("🚀 ~ getTodaysHabits ~ userId:", userId)
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayIndex = new Date().getDay();
    const today = daysOfWeek[todayIndex];
    console.log("🚀 ~ getTodaysHabits ~ today:", today)

    try {
        const habits = await Habit.find({
            user: userId,
            $or: [
                { 'repeat.type': 'daily' },
                { 'repeat.type': 'custom', 'repeat.daysOfWeek': today }
            ]
        });

        res.status(200).json(habits);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching today\'s habits', error });
    }
};

export const editHabit = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const habit = await Habit.findByIdAndUpdate(id, updates, { new: true });
        if (!habit) {
            res.status(404).json({ message: 'Habit not found' });
            return
        }

        res.status(200).json(habit);
    } catch (error) {
        res.status(500).json({ message: 'Error updating habit', error });
    }
};

export const deleteHabit = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const habit = await Habit.findByIdAndDelete(id);
        if (!habit) {
            res.status(404).json({ message: 'Habit not found' })
            return
        };

        res.status(200).json({ message: 'Habit deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting habit', error });
    }
};

export const markCompleted = async (req: Request, res: Response) => {
    try {
        const { habitId } = req.params;
        const today = new Date();

        // Find the habit by ID
        const habit = await Habit.findById(habitId);
        if (!habit) {
            res.status(404).json({ message: 'Habit not found' })
            return
        }

        // Add today's date to completedDates if not already marked as "Done" today
        const alreadyCompletedToday = habit.completedDates.some(
            date => date.toDateString() === today.toDateString()
        );
        if (!alreadyCompletedToday) {
            habit.completedDates.push(today);
        }

        // Calculate productivity percentage and update the field
        habit.productivityPercentage = calculateProductivityPercentage(habit);

        // Save the habit with updated completedDates and productivity percentage
        await habit.save();

        res.status(200).json({
            message: 'Habit marked as done for today',
            habit,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error marking habit as done', error });
    }
};