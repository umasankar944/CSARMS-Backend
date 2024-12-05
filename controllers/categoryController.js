import OracleDB from "oracledb";
import { getConnection } from "../models/db.js";

export const getCategories = async (req, res) => {
    try {
        const { userId } = req.params;
        const connection = await getConnection();
        const result = await connection.execute(`SELECT * FROM Categories WHERE USERID = :userId`,  { userId }, { outFormat: OracleDB.OUT_FORMAT_OBJECT });
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch categories", error });
    }
};

export const createCategory = async (req, res) => {
    const { name, description, userId} = req.body;

    try {
        const connection = await getConnection();
        await connection.execute(
            `INSERT INTO Categories (CATEGORYNAME, CATEGORYDESCRIPTION, USERID) VALUES (:name, :description, :userId)`,
            { name, description,userId },
            { autoCommit: true }
        );
        res.status(201).json({ message: "Category created successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to create category", error });
    }
};

export const updateCategory = async (req, res) => {
    const { categoryId } = req.params;
    const { name, description } = req.body;

    try {
        const connection = await getConnection();
        await connection.execute(
            `UPDATE Categories SET CATEGORYNAME = :name, CATEGORYDESCRIPTION = :description WHERE CATEGORYID = :categoryId`,
            { name, description, categoryId },
            { autoCommit: true }
        );
        res.status(200).json({ message: "Category updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to update category", error });
    }
};

export const deleteCategory = async (req, res) => {
    const { categoryId } = req.params;

    try {
        const connection = await getConnection();
        await connection.execute(
            `DELETE FROM Categories WHERE CATEGORYID = :categoryId`,
            { categoryId },
            { autoCommit: true }
        );
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete category", error });
    }
};
