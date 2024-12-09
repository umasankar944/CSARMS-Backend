import OracleDB from "oracledb";
import { getConnection } from "../models/db.js";

export const createTask = async (req, res) => {
    const { taskName, taskDescription, taskSchedule, notification, categoryId } = req.body;
  
    if (!taskName || !taskSchedule || !categoryId) {
      res.status(400);
      throw new Error('Please provide taskName, taskSchedule, and categoryId');
    }
  
    const connection = await getConnection();
  
    try {
      //connection = await oracledb.getConnection(dbConfig);
  
      const result = await connection.execute(
        `INSERT INTO tasks (TASK_NAME, TASK_DESCRIPTION, TASK_SCHEDULE, NOTIFICATION, CATEGORY_ID) 
         VALUES (:taskName, :taskDescription, TO_DATE(:taskSchedule, 'YYYY-MM-DD HH24:MI:SS'), :notification, :categoryId)`,
        { taskName, taskDescription, taskSchedule, notification, categoryId },
        { autoCommit: true }
      );
  
      res.status(201).json({message: 'Task created successfully', taskId: result.lastRowid ,status:201});
    } catch (error) {
        console.log(error)
      res.status(500).json({ message: 'Failed to create task', error,status:500 });
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  };
  
  // @desc    Get all tasks
  // @route   GET /api/tasks
  export const getTasks = async (req, res) => {
    const { categoryId } = req.params; // Get categoryId from request parameters
    const connection = await getConnection();

    try {
        const result = await connection.execute(
            `SELECT TASK_ID, TASK_NAME, TASK_DESCRIPTION, 
                    TO_CHAR(TASK_SCHEDULE, 'YYYY-MM-DD"T"HH24:MI:SS') AS TASK_SCHEDULE, 
                    NOTIFICATION, CATEGORY_ID 
             FROM tasks 
             WHERE CATEGORY_ID = :categoryId`, // Use a WHERE clause
            { categoryId }, // Bind the categoryId
            { outFormat: OracleDB.OUT_FORMAT_OBJECT }
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch tasks', error,status:500 });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

  
  // @desc    Update a task
  // @route   PUT /api/tasks/:id
  export const updateTask = async (req, res) => {
    const { taskId } = req.params;
    const { taskName, taskDescription, taskSchedule, notification, categoryId } = req.body;
  
    const connection = await getConnection();
  
    try {
      //connection = await oracledb.getConnection(dbConfig);
  
      const result = await connection.execute(
        `UPDATE tasks 
         SET TASK_NAME = :taskName, 
             TASK_DESCRIPTION = :taskDescription, 
             TASK_SCHEDULE = TO_DATE(:taskSchedule, 'YYYY-MM-DD HH24:MI:SS'), 
             NOTIFICATION = :notification, 
             CATEGORY_ID = :categoryId 
         WHERE TASK_ID = :taskId`,
        { taskId, taskName, taskDescription, taskSchedule, notification, categoryId },
        { autoCommit: true }
      );
  
      if (result.rowsAffected === 0) {
        res.status(404).json({ message: 'Task not found',status:404 });
      } else {
        res.status(200).json({ message: 'Task updated successfully',status:200 });
      }
    } catch (error) {
        console.log(error)
      res.status(500).json({ message: 'Failed to update task', error, status:500 });
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  };
  
  // @desc    Delete a task
  // @route   DELETE /api/tasks/:id
  export const deleteTask =async (req, res) => {
    const { taskId } = req.params;
  
    const connection = await getConnection();
  
    try {
      //onnection = await oracledb.getConnection(dbConfig);
  
      const result = await connection.execute(
        `DELETE FROM tasks WHERE TASK_ID = :taskId`,
        { taskId },
        { autoCommit: true }
      );
  
      if (result.rowsAffected === 0) {
        res.status(404).json({ message: 'Task not found',status:404 });
      } else {
        res.status(200).json({ message: 'Task deleted successfully' });
      }
    } catch (error) {
        console.log(error)
      res.status(500).json({ message: 'Failed to delete task', error ,status:500});
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  };
  