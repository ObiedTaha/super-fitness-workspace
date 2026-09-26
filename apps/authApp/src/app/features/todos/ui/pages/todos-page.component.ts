import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../data/todo.model';
import { TodosFacade } from '../../todos.facade';
import { TodoItemComponent } from '../components/todo-item.component';

@Component({
  selector: 'app-todos-page',
  imports: [FormsModule, TodoItemComponent],
  template: `
    <main class="page-shell">
      <header class="topline">
        <span class="brand-mark" aria-hidden="true">S</span>
        <span>SUPER FITNESS</span>
        <span class="topline-label">PERSONAL WORKSPACE</span>
      </header>

      <section class="workspace" aria-labelledby="page-title">
        <div class="heading-row">
          <div>
            <p class="eyebrow">YOUR DAY, IN MOTION</p>
            <h1 id="page-title">Today's tasks<span>.</span></h1>
          </div>
          <div class="task-count" aria-label="Open tasks">
            <strong>{{ openCount }}</strong>
            <span>OPEN</span>
          </div>
        </div>

        <form class="add-form" (ngSubmit)="addTask()">
          <label class="sr-only" for="new-task">Add a task</label>
          <input
            id="new-task"
            name="newTask"
            [(ngModel)]="newTask"
            placeholder="What would you like to get done?"
            autocomplete="off"
          />
          <button type="submit" [disabled]="!newTask.trim()" aria-label="Add task">
            <span aria-hidden="true">+</span>
          </button>
        </form>

        @if (facade.error()) {
          <p class="error-message" role="alert">{{ facade.error() }}</p>
        }

        <section class="list-section" aria-label="Task list">
          <div class="list-heading">
            <h2>Tasks</h2>
            <button class="refresh-button" type="button" (click)="facade.load()" [disabled]="facade.loading()">
              <span aria-hidden="true">↻</span> Refresh
            </button>
          </div>

          @if (facade.loading() && !facade.todos().length) {
            <p class="status-message">Loading tasks...</p>
          } @else if (!facade.todos().length) {
            <p class="status-message">Nothing on the list yet. Add your first task above.</p>
          } @else {
            <ul class="todo-list">
              @for (todo of facade.todos(); track todo.id) {
                <app-todo-item [todo]="todo" (toggleRequested)="toggleTask($event)" />
              }
            </ul>
          }
        </section>

        <footer class="list-footer">
          <span>{{ completedCount }} completed</span>
          <span>{{ facade.todos().length }} total</span>
        </footer>
      </section>
      <p class="footnote">SMALL STEPS. STRONGER DAYS.</p>
    </main>
  `,
  styles: `
    :host { display: block; min-height: 100vh; background: #f4f5f0; color: #202a24; font-family: 'Avenir Next', Avenir, 'Segoe UI', sans-serif; }
    * { box-sizing: border-box; }
    .page-shell { width: min(100% - 48px, 800px); margin: 0 auto; padding: 28px 0 24px; }
    .topline { display: flex; align-items: center; gap: 10px; color: #37423a; font-size: 11px; font-weight: 750; letter-spacing: 0; }
    .brand-mark { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 8px; background: #236b51; color: white; font-family: Georgia, serif; font-size: 17px; }
    .topline-label { margin-left: auto; color: #8a9088; font-size: 10px; font-weight: 600; }
    .workspace { margin-top: 76px; }
    .heading-row { display: flex; align-items: end; justify-content: space-between; gap: 20px; }
    .eyebrow { margin: 0 0 12px; color: #547963; font-size: 10px; font-weight: 750; }
    h1 { margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: clamp(38px, 7vw, 56px); font-weight: 500; line-height: 1.08; letter-spacing: 0; }
    h1 span { color: #e07a48; }
    .task-count { display: flex; flex-direction: column; align-items: end; gap: 3px; padding-bottom: 5px; }
    .task-count strong { color: #236b51; font-family: Georgia, serif; font-size: 30px; font-weight: 500; }
    .task-count span { color: #858c84; font-size: 9px; font-weight: 700; }
    .add-form { display: flex; gap: 10px; margin-top: 34px; }
    .add-form input { min-width: 0; flex: 1; height: 52px; padding: 0 16px; border: 1px solid #dfe2db; border-radius: 6px; outline: none; background: #fff; color: #27312b; font: inherit; font-size: 14px; }
    .add-form input:focus { border-color: #579174; box-shadow: 0 0 0 3px #236b5118; }
    .add-form input::placeholder { color: #a0a59e; }
    .add-form button { display: grid; place-items: center; width: 52px; height: 52px; border: 0; border-radius: 6px; background: #236b51; color: white; cursor: pointer; font: inherit; }
    .add-form button:hover:not(:disabled) { background: #19553f; }
    .add-form button:disabled { cursor: not-allowed; opacity: .45; }
    .add-form button span { font-size: 25px; line-height: 1; }
    .error-message { margin: 14px 0 0; color: #a34735; font-size: 13px; }
    .list-section { margin-top: 44px; }
    .list-heading { display: flex; align-items: center; justify-content: space-between; padding-bottom: 10px; border-bottom: 1px solid #d9ddd5; }
    .list-heading h2 { margin: 0; font-size: 13px; font-weight: 750; }
    .refresh-button { display: flex; align-items: center; gap: 6px; padding: 6px 0 6px 8px; border: 0; background: transparent; color: #547963; cursor: pointer; font: inherit; font-size: 12px; }
    .refresh-button:disabled { cursor: wait; opacity: .5; }
    .refresh-button span { font-size: 16px; }
    .todo-list { margin: 0; padding: 0; list-style: none; }
    .status-message { margin: 0; padding: 24px 0; color: #858c84; font-size: 13px; }
    .list-footer { display: flex; justify-content: space-between; padding-top: 14px; color: #858c84; font-size: 11px; }
    .footnote { margin: 100px 0 0; color: #9ca198; font-size: 9px; font-weight: 700; }
    .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
    @media (max-width: 600px) { .page-shell { width: min(100% - 36px, 800px); padding-top: 20px; } .workspace { margin-top: 56px; } .footnote { margin-top: 70px; } }
  `,
})
export class TodosPageComponent implements OnInit {
  readonly facade = inject(TodosFacade);
  newTask = '';

  get openCount(): number {
    return this.facade.todos().filter((todo) => !todo.completed).length;
  }

  get completedCount(): number {
    return this.facade.todos().filter((todo) => todo.completed).length;
  }

  ngOnInit(): void {
    this.facade.load();
  }

  addTask(): void {
    const title = this.newTask.trim();
    if (!title) return;
    this.facade.add(title);
    this.newTask = '';
  }

  toggleTask(todo: Todo): void {
    this.facade.toggle(todo);
  }
}