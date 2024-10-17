import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

export enum TodoStatus {
  Pending = "pending",
  Completed = "completed",
}

export interface ITodo {
  id?: number;
  name: string;
  shortDescription: string;
  dateAndTime: Date;
  status: TodoStatus;
}

export type ITodoCreation = Optional<ITodo, "id">;

export interface TodoInstance extends Model<ITodo, ITodoCreation>, ITodo {}

const Todo = sequelize.define<TodoInstance>(
  "Todo",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shortDescription: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateAndTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["pending", "completed"],
      defaultValue: "pending",
      allowNull: false,
    },
  },
  {
    tableName: "todos",
    timestamps: true,
  },
);

export default Todo;
