import oracledb from "oracledb";

const dbConfig = {
    user: "sys",
    password: "Deepu",
    connectString: "//localhost:1521/orcl",
    privilege: oracledb.SYSDBA, // Required for SYS user
};

export const getConnection = async () => {
    try {
        const connection = await oracledb.getConnection(dbConfig);
        console.log("db connected")
        return connection;
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        throw error;
    }
};
