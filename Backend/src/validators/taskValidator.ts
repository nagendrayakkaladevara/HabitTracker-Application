import { z } from 'zod';

export const createTaskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    priority: z.enum(['High', 'Medium', 'Low']).optional(),
    dueDate: z.string().optional(),
    status: z.enum(['Pending', 'Completed']).optional(),
    category: z.string().optional(),
    sharedWith: z.array(z.string()).optional(),
    recurring: z.boolean().optional(),
});
