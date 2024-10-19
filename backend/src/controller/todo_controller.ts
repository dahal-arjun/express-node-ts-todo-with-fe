import { ITodoService } from "../service/todo_service";
import { formatResponse } from "../utils/response";
import { TodoFilter } from "./filters";
import Joi from "joi";
import { Request, Response } from "express";
import { ITodo, ITodoCreation } from "../model/todo";

const todoCreationSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  shortDescription: Joi.string().max(250).required(),
  dateAndTime: Joi.date().greater("now").required(), // Date must be in the future
  status: Joi.string().valid("pending", "completed").required(),
});

const todoUpdateSchema = Joi.object({
  id: Joi.number().integer().required(), // Assuming id is a required integer
  name: Joi.string().min(1).max(100),
  shortDescription: Joi.string().max(250),
  dateAndTime: Joi.date().greater("now"),
  status: Joi.string().valid("pending", "completed"),
});

class TodoController {
  private todoService: ITodoService;

  constructor(todoService: ITodoService) {
    this.todoService = todoService;
  }

  public createTodo = async (req: Request, res: Response): Promise<void> => {
    const { error } = todoCreationSchema.validate(req.body);
    if (error) {
      const response = formatResponse(
        "error",
        undefined,
        "Validation error",
        error.details[0].message,
      );
      res.status(400).json(response);
      return;
    }

    try {
      const todoData: ITodoCreation = req.body;
      const todo = await this.todoService.createTodo(todoData);
      const response = formatResponse("success", todo);
      res.status(201).json(response);
    } catch (error: any) {
      const response = formatResponse(
        "error",
        undefined,
        "Error creating todo",
        error.message,
      );
      res.status(500).json(response);
    }
  };

  public getTodos = async (
    req: Request<{}, {}, {}, TodoFilter>,
    res: Response,
  ): Promise<void> => {
    try {
      const todos = await this.todoService.getTodos(req.query);
      const response = formatResponse("success", todos);
      res.status(200).json(response);
    } catch (error: any) {
      const response = formatResponse(
        "error",
        undefined,
        "Error fetching todos",
        error.message,
      );
      res.status(500).json(response);
    }
  };

  public getTodoById = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    try {
      const todo = await this.todoService.getTodoById(id);
      if (todo) {
        const response = formatResponse("success", todo);
        res.status(200).json(response);
      } else {
        const response = formatResponse("error", undefined, "Todo not found");
        res.status(404).json(response);
      }
    } catch (error: any) {
      const response = formatResponse(
        "error",
        undefined,
        "Error fetching todo",
        error.message,
      );
      res.status(500).json(response);
    }
  };

  public updateTodo = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    const updateData: Partial<ITodo> = req.body;

    const { error } = todoUpdateSchema.validate(updateData);
    if (error) {
      const response = formatResponse(
        "error",
        undefined,
        "Validation error",
        error.details[0].message,
      );
      res.status(400).json(response);
      return;
    }

    try {
      const updatedTodo = await this.todoService.updateTodo(id, updateData);
      if (updatedTodo) {
        const response = formatResponse("success", updatedTodo);
        res.status(200).json(response);
      } else {
        const response = formatResponse("error", undefined, "Todo not found");
        res.status(404).json(response);
      }
    } catch (error: any) {
      const response = formatResponse(
        "error",
        undefined,
        "Error updating todo",
        error.message,
      );
      res.status(500).json(response);
    }
  };

  public deleteTodo = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    try {
      const result = await this.todoService.deleteTodo(id);
      if (result) {
        res.status(204).send();
      } else {
        const response = formatResponse("error", undefined, "Todo not found");
        res.status(404).json(response);
      }
    } catch (error: any) {
      const response = formatResponse(
        "error",
        undefined,
        "Error deleting todo",
        error.message,
      );
      res.status(500).json(response);
    }
  };
}

export default TodoController;
