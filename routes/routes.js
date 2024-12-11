import express from "express";
import { login, register, getUserDetails, changePassword } from "../controllers/authController.js";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../controllers/categoryController.js";
import { createTask, deleteTask, getTasks, updateTask } from "../controllers/taskController.js";
import { notifications } from "../controllers/notificationController.js"
import multer from 'multer';
import { fileURLToPath } from 'url';
import path from 'path';
const uploadPath = path.resolve('uploads');

// Ensure that the upload path exists or create it if necessary
import fs from 'fs';

import { verifyToken } from "../middleware/authMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadPath, // Using the specific upload path here
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
    },
  }),
});

const router = express.Router();
router.use('/files', express.static(path.join(__dirname, 'uploads')));
router.get('/download/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(uploadPath, fileName);  // Ensure the file path is correct

    // Log the path for debugging
    console.log('Download path:', filePath);

    // Check if the file exists before attempting to download
    if (fs.existsSync(filePath)) {
        res.download(filePath, (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                res.status(500).send('Internal Server Error');
            }
        });
    } else {
        console.error('File not found:', filePath);
        res.status(404).send('File not found');
    }
});

router.post("/register", register);
router.post("/login", login);
router.post("/change-password",changePassword);
router.get("/getUserDetails",verifyToken, getUserDetails)
router.get("/categories/:userId", getCategories);
router.post("/categories", createCategory);
router.put("/categories/:categoryId", updateCategory);
router.delete("/categories/:categoryId", deleteCategory);
router.get("/tasks/:categoryId", getTasks);
router.post("/tasks",  upload.single('file'),createTask);
router.put("/tasks/:taskId", updateTask);
router.delete("/tasks/:taskId", deleteTask);
router.post("/notification",notifications)
export default router;
