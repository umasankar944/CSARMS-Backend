import express from "express";
import { login, register, getUserDetails } from "../controllers/authController.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/getUserDetails", getUserDetails)
export default router;
