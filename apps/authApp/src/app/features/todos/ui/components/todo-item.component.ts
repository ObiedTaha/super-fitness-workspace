import { Component, input, output } from '@angular/core';
import { Todo } from '../../data/todo.model';

@Component({
  selector: 'app-todo-item',
  template: `
    <li class="todo-row" [class.is-complete]="todo().completed">
      <button
        class="todo-check"
        type="button"
        [attr.aria-label]="todo().completed ? 'Mark task incomplete' : 'Mark task complete'"
        [attr.aria-pressed]="todo().completed"
        (click)="toggleRequested.emit(todo())"
      >
        <span aria-hidden="true">{{ todo().completed ? '✓' : '' }}</span>
      </button>
      <span class="todo-title">{{ todo().title }}</span>
      <span class="todo-state">{{ todo().completed ? 'Done' : 'Open' }}</span>
    </li>
  `,
  styles: `
    .todo-row { display: flex; align-items: center; gap: 14px; min-height: 66px; border-bottom: 1px solid #e7e8e4; }
    .todo-check { display: grid; place-items: center; width: 22px; height: 22px; flex: 0 0 22px; padding: 0; border: 1.5px solid #a5aaa2; border-radius: 50%; background: transparent; color: #fff; cursor: pointer; }
    .todo-check span { font-size: 14px; line-height: 1; }
    .is-complete .todo-check { border-color: #236b51; background: #236b51; }
    .todo-title { flex: 1; color: #27312b; font-size: 15px; }
    .is-complete .todo-title { color: #878d86; text-decoration: line-through; }
    .todo-state { color: #858c84; font-size: 11px; }
    @media (max-width: 480px) { .todo-state { display: none; } }
  `,
})
export class TodoItemComponent {
  readonly todo = input.required<Todo>();
  readonly toggleRequested = output<Todo>();
}