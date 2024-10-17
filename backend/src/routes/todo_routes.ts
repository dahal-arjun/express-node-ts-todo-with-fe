import { Router } from "express";
import TodoRepository from "../repository/todo_repository";
import TodoService from "../service/todo_service";
import TodoController from "../controller/todo_controller";

const router = Router();

const todoRepository = new TodoRepository();
const todoService = new TodoService(todoRepository);
const todoController = new TodoController(todoService);

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new todo
 *     tags: [Todo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               dateAndTime:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [pending, completed]
 *     responses:
 *       201:
 *         description: Todo created
 *       400:
 *         description: Validation error
 *       500:
 *         description: Error creating todo
 */
router.post("/", todoController.createTodo);
/**
 * @swagger
 * /:
 *   get:
 *     summary: Retrieve all todos
 *     tags: [Todo]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, completed]
 *         description: Filter by todo status
 *     responses:
 *       200:
 *         description: A list of todos
 *       500:
 *         description: Error fetching todos
 */
router.get("/", todoController.getTodos);

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Retrieve a todo by ID
 *     tags: [Todo]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the todo to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Todo found
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Error fetching todo
 */
router.get("/:id", todoController.getTodoById);
/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Update a todo by ID
 *     tags: [Todo]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the todo to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               dateAndTime:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [pending, completed]
 *     responses:
 *       200:
 *         description: Todo updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Error updating todo
 */
router.put("/:id", todoController.updateTodo);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Delete a todo by ID
 *     tags: [Todo]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the todo to delete
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Todo deleted
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Error deleting todo
 */
router.delete("/:id", todoController.deleteTodo);

export default router;
