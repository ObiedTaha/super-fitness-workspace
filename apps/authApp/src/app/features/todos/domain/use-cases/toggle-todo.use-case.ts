import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TodoRepository } from '../../data/todo.repository';
import { Todo } from '../../data/todo.model';

@Injectable({ providedIn: 'root' })
export class ToggleTodoUseCase {
  private readonly todoRepository = inject(TodoRepository);

  execute(todo: Todo): Observable<Todo> {
    return this.todoRepository.toggle(todo);
  }
}