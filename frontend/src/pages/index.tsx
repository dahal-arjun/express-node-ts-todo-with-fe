"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Edit2, CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Todo {
  id: number;
  name: string;
  shortDescription: string;
  dateAndTime: string;
  status: "pending" | "completed";
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoName, setNewTodoName] = useState("");
  const [newTodoDescription, setNewTodoDescription] = useState("");
  const [newTodoDate, setNewTodoDate] = useState<Date | undefined>(undefined);
  const [newTodoTime, setNewTodoTime] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editingTodoDate, setEditingTodoDate] = useState<Date | undefined>(
    undefined
  );
  const [editingTodoTime, setEditingTodoTime] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch("http://localhost:8003/api/todos/");
      if (!response.ok) throw new Error("Failed to fetch todos");
      const result = await response.json();
      setTodos(result.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
      setError("Failed to fetch todos. Please try again.");
    }
  };

  const addTodo = async () => {
    setError("");
    if (newTodoName.trim() === "") {
      setError("Todo name is required");
      return;
    }
    if (!newTodoDate) {
      setError("Date is required");
      return;
    }
    if (newTodoTime.trim() === "") {
      setError("Time is required");
      return;
    }

    const dateTime = new Date(newTodoDate);
    const [hours, minutes] = newTodoTime.split(":");
    dateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));

    const newTodoItem = {
      name: newTodoName,
      shortDescription: newTodoDescription,
      dateAndTime: dateTime.toISOString(),
      status: "pending" as const,
    };

    try {
      const response = await fetch("http://localhost:8003/api/todos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodoItem),
      });

      if (!response.ok) throw new Error("Failed to add todo");

      await fetchTodos();
      setNewTodoName("");
      setNewTodoDescription("");
      setNewTodoDate(undefined);
      setNewTodoTime("");
    } catch (error) {
      console.error("Error adding todo:", error);
      setError("Failed to add todo. Please try again.");
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8003/api/todos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete todo");

      await fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
      setError("Failed to delete todo. Please try again.");
    }
  };

  const openEditDialog = (todo: Todo) => {
    setEditingTodo(todo);
    setEditingTodoDate(new Date(todo.dateAndTime));
    const formattedTime = format(new Date(todo.dateAndTime), "HH:mm");
    setEditingTodoTime(formattedTime);
    setIsEditing(true);
  };

  const closeEditDialog = () => {
    setIsEditing(false);
    setEditingTodo(null);
    setEditingTodoDate(undefined);
    setEditingTodoTime("");
  };

  const updateTodo = async () => {
    if (!editingTodo || !editingTodoDate || editingTodoTime.trim() === "")
      return;

    const dateTime = new Date(editingTodoDate);
    const [hours, minutes] = editingTodoTime.split(":");
    dateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));

    const updatedTodoItem = {
      ...editingTodo,
      dateAndTime: dateTime.toISOString(),
    };

    try {
      const response = await fetch(
        `http://localhost:8003/api/todos/${editingTodo.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTodoItem),
        }
      );

      if (!response.ok) throw new Error("Failed to update todo");

      await fetchTodos();
      closeEditDialog();
    } catch (error) {
      console.error("Error updating todo:", error);
      setError("Failed to update todo. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center text-primary">
        Todo App
      </h1>
      <div className="flex flex-col mb-4">
        <Input
          type="text"
          value={newTodoName}
          onChange={(e) => setNewTodoName(e.target.value)}
          placeholder="Todo name"
          className="mb-2"
        />
        <Input
          type="text"
          value={newTodoDescription}
          onChange={(e) => setNewTodoDescription(e.target.value)}
          placeholder="Short description"
          className="mb-2"
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal mb-2 text-black",
                !newTodoDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {newTodoDate ? (
                format(newTodoDate, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={newTodoDate}
              onSelect={setNewTodoDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Input
          type="time"
          value={newTodoTime}
          onChange={(e) => setNewTodoTime(e.target.value)}
          className="mb-2"
        />
        <Button onClick={addTodo}>Add</Button>
      </div>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {todos && todos.length > 0 ? (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between bg-secondary p-3 rounded text-black"
            >
              <div>
                <span
                  className={`${
                    todo.status === "completed"
                      ? "line-through text-black"
                      : "text-black"
                  }`}
                >
                  {todo.name} - {format(new Date(todo.dateAndTime), "PPP p")}
                </span>
              </div>
              <div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEditDialog(todo)}
                  className="mr-2"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTodo(todo.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No todos in the list</p>
      )}

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Todo</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              value={editingTodo?.name || ""}
              onChange={(e) =>
                setEditingTodo((prev) =>
                  prev ? { ...prev, name: e.target.value } : null
                )
              }
              placeholder="Todo name"
            />
            <Input
              value={editingTodo?.shortDescription || ""}
              onChange={(e) =>
                setEditingTodo((prev) =>
                  prev ? { ...prev, shortDescription: e.target.value } : null
                )
              }
              placeholder="Short description"
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal mb-2 text-black",
                    !editingTodoDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {editingTodoDate ? (
                    format(editingTodoDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={editingTodoDate}
                  onSelect={setEditingTodoDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Input
              type="time"
              value={editingTodoTime}
              onChange={(e) => setEditingTodoTime(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={closeEditDialog} variant="outline">
              Cancel
            </Button>
            <Button onClick={updateTodo}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
