import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from '../enums/Status';
import { Priority } from '../enums/Priority';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({
    type: 'text',
  })
  title: string;
  
  @Column({
    type: 'varchar',
    length: 255,
  })
  date: string;
  
  @Column({
    // type: 'longtext' --mysql format
    type: 'text'
  })
  description: string;
  
  @Column({
    type: 'enum',
    enum: Priority,
    default: Priority.normal
  })
  priority: Priority;
  
  @Column({
    type: 'enum',
    enum: Status,
    default: Status.todo
  })
  status: Status;
}
