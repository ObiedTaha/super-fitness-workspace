import { inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { AddTodoUseCase } from './domain/use-cases/add-todo.use-case';
import { GetTodosUseCase } from './domain/use-cases/get-todos.use-case';
import { ToggleTodoUseCase } from './domain/use-cases/toggle-todo.use-case';
import { Todo } from './data/todo.model';

@Injectable({ providedIn: 'root' })
export class TodosFacade {
  readonly todos = signal<Todo[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');

  private readonly getTodos = inject(GetTodosUseCase);
  private readonly addTodo = inject(AddTodoUseCase);
  private readonly toggleTodo = inject(ToggleTodoUseCase);

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.getTodos
      .execute()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (todos) => this.todos.set(todos),
        error: () => this.error.set('Could not load tasks. Please try again.'),
      });
  }

  add(title: string): void {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    this.error.set('');
    this.addTodo.execute(trimmedTitle).subscribe({
      next: (todo) => this.todos.update((todos) => [todo, ...todos]),
      error: () => this.error.set('Could not add this task. Please try again.'),
    });
  }

  toggle(todo: Todo): void {
    this.error.set('');
    this.toggleTodo.execute(todo).subscribe({
      next: (updatedTodo) =>
        this.todos.update((todos) =>
          todos.map((item) => (item.id === updatedTodo.id ? updatedTodo : item))
        ),
      error: () =>
        this.error.set('Could not update this task. Please try again.'),
    });
  }
}