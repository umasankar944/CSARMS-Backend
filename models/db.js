import oracledb from "oracledb";

const config = {
    user: "sys",
    password: "Deepu",
    connectString: "//localhost:1521/orcl", // Example: "localhost:1521/xepdb1"
    privilege: oracledb.SYSDBA,
 // Example: "localhost:1521/xepdb1"
};

export const getConnection = async () => {
    try {
        const connection = await oracledb.getConnection(config);
        console.log("db connected")
        return connection;
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        throw error;
    }
};
