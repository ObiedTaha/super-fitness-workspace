export interface TodoDto {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

export interface CreateTodoDto {
  title: string;
  completed: boolean;
  userId: number;
}