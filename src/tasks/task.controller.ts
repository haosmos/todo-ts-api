import { AppDataSource } from '../../index';
import { Task } from './tasks.entity';
import { instanceToPlain } from 'class-transformer';

export class TaskController {
  constructor(private taskRepository = AppDataSource.getRepository(Task)) {}
  
  public async getAllTasks(): Promise<Task[] | undefined> {
    let allTasks: Task[];
    
    try {
      allTasks = await this.taskRepository.find({
        order: {
          date: 'ASC',
        }
      });
      
      allTasks = instanceToPlain(allTasks) as Task[];
      
      return allTasks;
      
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }
}
