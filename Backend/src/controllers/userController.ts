
import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';

export const createUser = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    try {

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: 'Email already in use' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            preferences: {
                theme: 'light',
                notificationsEnabled: true,
            },
        });

        await user.save();
        res.status(201).json({
            message: 'Registration successful', user: {
                id: user._id,
                name: user.name,
                email: user.email,
                preferences: user.preferences,
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
};


export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ error: 'Invalid email or password' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ error: 'Invalid email or password' });
            return;
        }

        res.status(200).json({ message: 'Login successful', user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: 'Failed to login user' });
    }
};