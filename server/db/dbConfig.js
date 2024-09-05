const sql = require("mssql");
require("dotenv").config();

var config = {
    user: process.env.USER,
    password: process.env.PASSWORD,
    server: process.env.SERVER,
    database: process.env.DATABASE,
    options: {
        encrypt: true,  
        trustServerCertificate: true
    },
};

const poolPromise = sql.connect(config,function(err){
    if(err) throw err;
    else console.log("Database connected");
})


module.exports = {
    sql,
    poolPromise
};