import { Op } from "sequelize";
import Todo, { ITodo, TodoInstance } from "../model/todo";

export interface ITodoRepository {
  create(todoData: ITodo): Promise<ITodo>;
  findById(id: number): Promise<ITodo | null>;
  update(id: number, updateData: Partial<ITodo>): Promise<ITodo | null>;
  delete(id: number): Promise<number>;
  findAll(): Promise<ITodo[]>;
  filterTodos(status: string): Promise<ITodo[]>;
  getUpcomingTodos(currentDate: Date): Promise<ITodo[]>;
}

class TodoRepository implements ITodoRepository {
  async create(todoData: ITodo): Promise<ITodo> {
    const todo: TodoInstance = await Todo.create(todoData);
    return todo.get({ plain: true }) as ITodo;
  }

  async findAll(): Promise<ITodo[]> {
    const todos: TodoInstance[] = await Todo.findAll();
    return todos.map((todo) => todo.get({ plain: true })) as ITodo[];
  }

  async getUpcomingTodos(currentDate: Date): Promise<ITodo[]> {
    const upcomingTodos: TodoInstance[] = await Todo.findAll({
      where: {
        status: "pending",
        dateAndTime: { [Op.gt]: currentDate },
      },
    });
    return upcomingTodos.map((todo) => todo.get({ plain: true })) as ITodo[];
  }

  async filterTodos(status: string): Promise<ITodo[]> {
    const filteredTodos: TodoInstance[] = await Todo.findAll({
      where: { status },
    });
    return filteredTodos.map((todo) => todo.get({ plain: true })) as ITodo[];
  }

  async findById(id: number): Promise<ITodo | null> {
    const todo: TodoInstance | null = await Todo.findByPk(id);
    return todo ? (todo.get({ plain: true }) as ITodo) : null;
  }

  async update(id: number, updateData: Partial<ITodo>): Promise<ITodo | null> {
    await Todo.update(updateData, { where: { id } });
    return this.findById(id);
  }

  async delete(id: number): Promise<number> {
    return await Todo.destroy({ where: { id } });
  }
}

export default TodoRepository;
