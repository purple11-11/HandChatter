const dotenv = require("dotenv");
dotenv.config();

// local
const development = {
    username: "sesac",
    password: process.env.DB_PASSWORD,
    database: "handchatter",
    host: "127.0.0.1",
    dialect: "mysql",
};

// ssh
// const production = {
//     username: process.env.RDS_USERNAME,
//     password: process.env.RDS_PASSWORD,
//     database: "sesac",
//     host: process.env.RDS_HOST,
//     dialect: "mysql",
// };

module.exports = { development };
//module.exports = { development, production };
