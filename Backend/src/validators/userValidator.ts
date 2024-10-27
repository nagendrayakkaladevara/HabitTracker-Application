import { z } from 'zod';

export const createUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    preferences: z.object({
        theme: z.enum(['light', 'dark']).optional(),
        notificationsEnabled: z.boolean().optional(),
    }).optional(),
});
