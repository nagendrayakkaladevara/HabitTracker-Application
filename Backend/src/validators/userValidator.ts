import { z } from 'zod';

export const createUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, 'Password must be at least 8 characters long')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[a-zA-Z]/, 'Password must contain at least one letter'),
    preferences: z.object({
        theme: z.enum(['light', 'dark']).optional(),
        notificationsEnabled: z.boolean().optional(),
    }).optional(),
});

export const loginUserSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, 'Password must be at least 8 characters long')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[a-zA-Z]/, 'Password must contain at least one letter'),
});