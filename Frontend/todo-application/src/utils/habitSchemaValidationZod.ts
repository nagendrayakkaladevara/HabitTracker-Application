import { z } from 'zod';

export const habitSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().optional(),
    repeat: z.enum(['daily', 'weekly', 'custom'], { required_error: 'Select a repeat option' }),
    daysOfWeek: z.array(z.enum(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])).optional(),
});

export type HabitFormValues = z.infer<typeof habitSchema>;