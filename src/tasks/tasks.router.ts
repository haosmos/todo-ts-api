import { Router, Request, Response } from 'express';
import { TaskController } from './task.controller';
import { validationResult } from 'express-validator';
import { createValidator } from './tasks.validator';

export const tasksRouter: Router = Router();

tasksRouter.get(
  '/tasks',
  async (req: Request, res: Response) => {
    const taskController = new TaskController();
    const allTask = await taskController.getAllTasks();
    res.json(allTask).status(200);
  }
);

tasksRouter.post(
  '/tasks',
  createValidator,
  // @ts-ignore
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({
          errors: errors.array()
        });
    }
  }
);
