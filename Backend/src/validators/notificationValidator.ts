import { z } from 'zod';

export const createNotificationSchema = z.object({
    userId: z.string(),
    taskId: z.string(),
    message: z.string().min(1, "Message is required"),
    isRead: z.boolean().optional(),
});
