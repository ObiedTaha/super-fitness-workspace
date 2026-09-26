import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TodoRepository } from '../../data/todo.repository';
import { Todo } from '../../data/todo.model';

@Injectable({ providedIn: 'root' })
export class AddTodoUseCase {
  private readonly todoRepository = inject(TodoRepository);

  execute(title: string): Observable<Todo> {
    return this.todoRepository.add(title.trim());
  }
}