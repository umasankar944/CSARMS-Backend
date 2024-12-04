import OracleDB from "oracledb";
import { getConnection } from "../models/db.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
    const { username, password, firstname, lastname, email, phone } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const connection = await getConnection();
        await connection.execute(
            `INSERT INTO USERS (USERNAME, PASSWORD, FIRSTNAME, LASTNAME, EMAIL, PHONE) 
             VALUES (:username, :password, :firstname, :lastname, :email, :phone)`,
            { username, password: hashedPassword, firstname, lastname, email, phone },
            { autoCommit: true }
        );
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Registration failed", error });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;
 console.log(username,password)
    try {
        if (!(username && password)) {
            return res.status(400).send("username, password, and role are required");
        }
        const connection = await getConnection();
        const result = await connection.execute(
            `SELECT * FROM USERS WHERE USERNAME = :username`,
            { username },
            { outFormat: OracleDB.OUT_FORMAT_OBJECT }
        );
       console.log(result)
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.PASSWORD);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        console.error("Error during login:", error);

        res.status(500).json({ message: "Login failed", error });
    }
};
