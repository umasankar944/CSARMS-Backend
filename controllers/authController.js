import OracleDB from "oracledb";
import { getConnection } from "../models/db.js";
import bcrypt from "bcrypt";

export const getUserDetails = async (req, res) => {
    try {
        const connection = await getConnection();
        //const role = req.user.role; //Assuming you have the user's role set in req.user
        console.log("get user: ",req.user)
        let user;
        if (req.user) {
            const result = await connection.execute(
                `SELECT * FROM USERS WHERE USERNAME = :username`,
                { username: req.user.username },
                { outFormat: oracledb.OUT_FORMAT_OBJECT }
            );

            user = result.rows[0];
        }

        await connection.close();

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        console.log(error);
        if (error.name === "TokenExpiredError") {
            res.status(401).send("Token expired");
        } else {
            res.status(500).send("Internal Server Error");
        }
    }
}

export const register = async (req, res) => {
    const { email,firstname, lastname, password, phone, username } = req.body;

    try {
        const connection = await getConnection();
        const userResult = await connection.execute(
            `SELECT * FROM USERS WHERE USERNAME = :username`,
            { username }
        );
        
        if (userResult.rows.length > 0) {
            return res.status(203).json({ message: `User name already exists`,status:203 });
        }
        else{
        const hashedPassword = await bcrypt.hash(password, 10);
        await connection.execute(
            `INSERT INTO USERS (USERNAME, PASSWORD, FIRSTNAME, LASTNAME, EMAIL, PHONE) 
             VALUES (:username, :password, :firstname, :lastname, :email, :phone)`,
            { username, password: hashedPassword, firstname, lastname, email, phone },
            { autoCommit: true }
        );
        res.status(201).json({ message: "User registered successfully" ,status:201});
        }
    } catch (error) {
        res.status(500).json({ message: "Registration failed", error, status:500 });
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
            res.status(404).json({ message: "User not found", status:404 });
        }

        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.PASSWORD);

        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid credentials", status:401 });
        }

        res.status(200).json({ message: "Login successful", user, status:200 });
    } catch (error) {
        console.error("Error during login:", error);

        res.status(500).json({ message: "Login failed", error , status:500});
    }
};
