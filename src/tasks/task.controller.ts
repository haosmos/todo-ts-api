import { AppDataSource } from '../../index';
import { Task } from './tasks.entity';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { UpdateResult } from 'typeorm';

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
  
  // Updating task
  public async updateTask(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array() });
    }
    
    // try to find if the task exists
    let task: Task | null;
    
    try {
      task = await AppDataSource
        .getRepository(Task)
        .findOne(
          {
            where: {
              id: req.body.id
            }
          });
      
      // return res
      //   .json(task)
      //   .status(200);
      
    } catch (errors) {
      return res
        .json({ error: 'Internal server error' })
        .status(500);
    }
    
    // return 400 if task is null
    if (!task) {
      return res
        .status(404)
        .json({ error: 'Task with given ID does not found' });
    }
    
    // declare a variable for updatedTask
    let updatedTask: UpdateResult;
    
    // update the task
    try {
      updatedTask = await AppDataSource
        .getRepository(Task)
        .update(
          req.body.id,
          plainToInstance(Task, {
            status: req.body.status,
          })
        );
      
      // convert the updatedTask instance to an object
      updatedTask = instanceToPlain(updatedTask) as UpdateResult;
      
      return res
        .json(updatedTask)
        .status(200);
      
    } catch (e) {
      return res
        .json({ error: 'Internal server error' })
        .status(500);
    }
  }
}

export const taskController = new TaskController();
