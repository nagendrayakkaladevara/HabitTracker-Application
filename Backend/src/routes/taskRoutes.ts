import express from 'express';
import { createTask } from '../controllers/taskController';
import validateRequest from '../middlewares/validateRequest';
import { createTaskSchema } from '../validators/taskValidator';

const router = express.Router();

router.post('/', validateRequest(createTaskSchema), createTask);

export default router;
