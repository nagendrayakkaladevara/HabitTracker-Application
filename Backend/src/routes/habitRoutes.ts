import express from 'express';
import { createHabit, deleteHabit, editHabit, getTodaysHabits, markCompleted } from '../controllers/habitController';

const router = express.Router();

router.post('/createHabit', createHabit);
router.get('/today/:userId', getTodaysHabits);
router.put('/:id', editHabit);
router.delete('/:id', deleteHabit);
router.post('/mark-done/:habitId', markCompleted);

export default router;