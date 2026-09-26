import { Injectable } from '@angular/core';
import { ApiClient } from '@super-fitness/data-access-user';
import { map, Observable } from 'rxjs';
import { CreateTodoDto, TodoDto } from './todo.dto';
import { createTodoToDto, todoDtoToModel } from './todo.mapper';
import { Todo } from './todo.model';

@Injectable({ providedIn: 'root' })
export class TodoRepository extends ApiClient<TodoDto> {
  protected readonly endpoint = 'todos';

  getAll(): Observable<Todo[]> {
    return this.get<TodoDto[]>({ _limit: 8 }).pipe(
      map((todos) => todos.map(todoDtoToModel))
    );
  }

  add(title: string): Observable<Todo> {
    const payload: CreateTodoDto = createTodoToDto(title);
    return this.post<TodoDto, CreateTodoDto>(payload).pipe(map(todoDtoToModel));
  }

  toggle(todo: Todo): Observable<Todo> {
    return this.patch<TodoDto, Pick<TodoDto, 'completed'>>(todo.id, {
      completed: !todo.completed,
    }).pipe(map(todoDtoToModel));
  }
}