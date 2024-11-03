import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

const validateRequest = (schema: ZodSchema<any>) => (req: Request, res: Response, next: NextFunction): void => {
    const validation = schema.safeParse(req.body);
    if (!validation.success) {
        res.status(400).json({ message: validation.error.errors[0].message });
        return;
    }
    next();
};

export default validateRequest;