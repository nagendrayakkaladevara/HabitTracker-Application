import { Request, Response } from 'express';
import Notification from '../models/Notification';

export const createNotification = async (req: Request, res: Response) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create notification' });
  }
};