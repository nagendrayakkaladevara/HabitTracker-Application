import { Request, Response } from 'express';
import Task from '../models/Task';
import User from '../models/User';

export const createTask = async (req: Request, res: Response) => {
  const { title, description, priority, dueDate, status, subtasks, category, sharedWith, recurring, email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return
    }

    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      status,
      subtasks,
      category,
      sharedWith,
      recurring,
      email,
    });

    await task.save();
    res.status(201).json({ Message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const getUserTasks = async (req: Request, res: Response) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return
    }

    const tasks = await Task.find({ email: email });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve tasks' });
  }
};