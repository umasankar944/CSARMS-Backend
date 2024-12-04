import { getConnection } from "../models/db.js";

export const getCategories = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.execute(`SELECT * FROM Categories`, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch categories", error });
    }
};

export const createCategory = async (req, res) => {
    const { categoryName, categoryDescription } = req.body;

    try {
        const connection = await getConnection();
        await connection.execute(
            `INSERT INTO Categories (CATEGORYNAME, CATEGORYDESCRIPTION) VALUES (:categoryName, :categoryDescription)`,
            { categoryName, categoryDescription },
            { autoCommit: true }
        );
        res.status(201).json({ message: "Category created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to create category", error });
    }
};

export const updateCategory = async (req, res) => {
    const { categoryId } = req.params;
    const { categoryName, categoryDescription } = req.body;

    try {
        const connection = await getConnection();
        await connection.execute(
            `UPDATE Categories SET CATEGORYNAME = :categoryName, CATEGORYDESCRIPTION = :categoryDescription WHERE CATEGORYID = :categoryId`,
            { categoryName, categoryDescription, categoryId },
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
