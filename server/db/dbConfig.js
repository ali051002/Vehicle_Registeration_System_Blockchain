const sql = require("mssql");
require("dotenv").config();  // Load environment variables from .env file


// console.log("DB_USER:", process.env.DB_USER);
// console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DATABASE:", process.env.DB_DATABASE);
console.log("SERVER:", process.env.DB_SERVER);

// Check if environment variables are loaded correctly
if (!process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_SERVER || !process.env.DB_DATABASE) {
    console.error("Error: Missing required environment variables.");
    process.exit(1);
}

// Configuration object for SQL Server connection
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

// Establish the connection and handle errors
const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log("Database connected successfully!");
        return pool;
    })
    .catch(err => {
        console.error("Database connection failed: ", err.message);
        process.exit(1);
    });

module.exports = {
    sql,
    poolPromise
};
