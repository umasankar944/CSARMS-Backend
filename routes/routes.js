import express from "express";
import { login, register, getUserDetails } from "../controllers/authController.js";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../controllers/categoryController.js";
import { createTask, deleteTask, getTasks, updateTask } from "../controllers/taskController.js";
import { notifications } from "../controllers/notificationController.js"

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/getUserDetails", getUserDetails)
router.get("/categories/:userId", getCategories);
router.post("/categories", createCategory);
router.put("/categories/:categoryId", updateCategory);
router.delete("/categories/:categoryId", deleteCategory);
router.get("/tasks/:categoryId", getTasks);
router.post("/tasks", createTask);
router.put("/tasks/:taskId", updateTask);
router.delete("/tasks/:taskId", deleteTask);
router.post("/notification",notifications)
export default router;
