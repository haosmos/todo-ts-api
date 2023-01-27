import { AppDataSource } from '../../index';
import { Task } from './tasks.entity';
import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

class TaskController {
  // GET
  public async getAllTasks(req: Request, res: Response): Promise<Response> {
    let allTasks: Task[];
    
    try {
      allTasks = await AppDataSource
        .getRepository(Task)
        .find({
          order: {
            date: 'ASC',
          }
        });
      
      allTasks = instanceToPlain(allTasks) as Task[];
      
      return res.json(allTasks).status(200);
      
    } catch (_error) {
      return res
        .json({ error: 'Internal server error' })
        .status(500);
    }
  }
  
  // POST
  public async createTask(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({
          errors: errors.array()
        });
    }
    
    const newTask = new Task();
    
    newTask.title = req.body.title;
    newTask.date = req.body.date;
    newTask.description = req.body.description;
    newTask.priority = req.body.priority;
    newTask.status = req.body.status;
    
    let createdTask: Task;
    
    try {
      createdTask = await AppDataSource
        .getRepository(Task)
        .save(newTask);
      
      createdTask = instanceToPlain(createdTask) as Task;
      
      return res.json(createdTask).status(201);
    } catch (err) {
      return res
        .json({ error: 'Internal server error' })
        .status(500);
    }
  }
  
}

export const taskController = new TaskController();
