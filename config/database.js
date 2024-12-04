import oracledb from "oracledb";

const dbConfig = {
    user: "your_username",
    password: "your_password",
    connectString: "//localhost:1521/orcl",
};

export const getConnection = async () => {
    try {
        const connection = await oracledb.getConnection(dbConfig);
        return connection;
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        throw error;
    }
};
