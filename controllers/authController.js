import OracleDB from "oracledb";
import { getConnection } from "../models/db.js";
import bcrypt from "bcrypt";
import Jwt from 'jsonwebtoken';
const TOKEN = "CSARMS";


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
                { outFormat: OracleDB.OUT_FORMAT_OBJECT }
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
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required", status: 400 });
        }
        const connection = await getConnection();
        const result = await connection.execute(
            `SELECT * FROM USERS WHERE USERNAME = :username`,
            { username },
            { outFormat: OracleDB.OUT_FORMAT_OBJECT }
        );
       console.log(result)
       if (result.rows.length === 0) {
        // User not found
        return res.status(404).json({ message: "User not found", status: 404 });
    }


        const user = result.rows[0];
         // Validate password
         const isPasswordValid = await bcrypt.compare(password, user.PASSWORD);
         if (!isPasswordValid) {
             return res.status(401).json({ message: "Invalid credentials", status: 401 });
         }
 
         // Generate JWT token
         const token = Jwt.sign(
             { id: user.ID, username: user.USERNAME }, // Include more info in payload as needed
            TOKEN, // Ensure the secret key is loaded from environment variables
             { expiresIn: "1h" } // Token expiration
         );
        // Send response
        return res.status(200).json({
            message: "Login successful",
            status: 200,
            user: {
                id: user.USERID,
                username: user.USERNAME,
                firstname: user.FIRSTNAME,
                lastname: user.LASTNAME,
                email: user.EMAIL,
                phone: user.PHONE,
                token,
            },
        });

    } catch (error) {
        console.error("Error during login:", error);

        return res.status(500).json({ message: "Login failed", error: error.message, status: 500 });

    }
};

export const changePassword = async (req, res) => {
    const { username, oldPassword, newPassword } = req.body;
    console.log(username, oldPassword, newPassword)
    try {
        const connection = await getConnection();

        // Check if the user exists
        const userResult = await connection.execute(
            `SELECT * FROM USERS WHERE USERNAME = :username`,
            { username }
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: "User not found", status: 404 });
        }
        
        const user = userResult.rows[0];
        console.log(user)
        const storedPassword = user[2]; // Assuming PASSWORD is the column name in your USERS table

        // Verify the old password
        const isPasswordValid = await bcrypt.compare(oldPassword, storedPassword);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Old password is incorrect", status: 400 });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        await connection.execute(
            `UPDATE USERS SET PASSWORD = :newPassword WHERE USERNAME = :username`,
            { newPassword: hashedNewPassword, username },
            { autoCommit: true }
        );

        res.status(200).json({ message: "Password changed successfully", status: 200 });
    } catch (error) {
        console.error("Error in changePassword:", error);
        res.status(500).json({ message: "Password change failed", error, status: 500 });
    }
};

export const updateUserDetails = async (req, res) => {
    const { username, firstName, lastName, email, phone } = req.body;
    console.log(firstName,lastName,email,phone)
    try {
        const connection = await getConnection();

        if (!firstName || !lastName || !email || !phone) 
            { return res.status(400).json({ error: 'All fields are required' }); 
        }

        // Check if the user exists
        const userResult = await connection.execute(
            `SELECT * FROM USERS WHERE USERNAME = :username`,
            { username }
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: "User not found", status: 404 });
        }
        
        const user = userResult.rows[0];
        console.log(user)

        // Update the details in the database
        await connection.execute(
            `UPDATE USERS SET FIRSTNAME = :firstName, LASTNAME = :lastName, EMAIL = :email, PHONE = :phone WHERE USERNAME = :username`,
            { firstName: firstName, lastName: lastName, email: email, phone: phone, username:username },
            { autoCommit: true }
        );

        res.status(200).json({ message: "User Details Updated successfully", status: 200 });
    } catch (error) {
        console.error("Error in updating the details:", error);
        res.status(500).json({ message: "Updating details failed", error, status: 500 });
    }
};
