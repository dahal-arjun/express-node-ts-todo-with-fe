import { TodoFilter } from "../controller/filters";
import { ITodo } from "../model/todo";
import { ITodoRepository } from "../repository/todo_repository";

export interface ITodoService {
  createTodo(todoData: ITodo): Promise<ITodo>;
  getTodos(filter: TodoFilter): Promise<ITodo[]>;
  getTodoById(id: number): Promise<ITodo | null>;
  updateTodo(id: number, updateData: Partial<ITodo>): Promise<ITodo | null>;
  deleteTodo(id: number): Promise<number>;
}

class TodoService implements ITodoService {
  private todoRepository: ITodoRepository;

  constructor(todoRepository: ITodoRepository) {
    this.todoRepository = todoRepository;
  }

  async createTodo(todoData: ITodo): Promise<ITodo> {
    return await this.todoRepository.create(todoData);
  }

  async getTodos(filter: TodoFilter): Promise<ITodo[]> {
    const { status: statusFilter } = filter;
    switch (statusFilter) {
      case "upcoming":
        return await this.todoRepository.getUpcomingTodos(new Date());

      case "pending":
        return await this.todoRepository.filterTodos("pending");

      case "completed":
        return await this.todoRepository.filterTodos("completed");

      default:
        return await this.todoRepository.findAll();
    }
  }

  async getTodoById(id: number): Promise<ITodo | null> {
    return await this.todoRepository.findById(id);
  }

  async updateTodo(
    id: number,
    updateData: Partial<ITodo>,
  ): Promise<ITodo | null> {
    return await this.todoRepository.update(id, updateData);
  }

  async deleteTodo(id: number): Promise<number> {
    return await this.todoRepository.delete(id);
  }
}

export default TodoService;
