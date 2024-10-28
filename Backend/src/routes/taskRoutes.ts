import express from 'express';
import { createTask, getUserTasks } from '../controllers/taskController';
import validateRequest from '../middlewares/validateRequest';
import { createTaskSchema } from '../validators/taskValidator';


const router = express.Router();

router.post('/createTask', validateRequest(createTaskSchema), createTask);
router.get('/getTask/:email', getUserTasks); 

export default router;
