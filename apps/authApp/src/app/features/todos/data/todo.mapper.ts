import { CreateTodoDto, TodoDto } from './todo.dto';
import { Todo } from './todo.model';

export function todoDtoToModel(dto: TodoDto): Todo {
  return {
    id: dto.id,
    title: dto.title,
    completed: dto.completed,
    userId: dto.userId,
  };
}

export function createTodoToDto(title: string): CreateTodoDto {
  return {
    title,
    completed: false,
    userId: 1,
  };
}