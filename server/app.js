const express = require("express");
const app = express();
const dotenv = require("dotenv");
const PORT = process.env.PORT;
const http = require("http");
const { sequelize } = require("./models");
const indexRouter = require("./routes");
const serverPrefix = "/api";
const cors = require("cors");
const server = http.createServer(app);
const socketHadnler = require("./sockets");

socketHadnler(server);
dotenv.config();

// body-parser 설정
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// route 설정
app.use(serverPrefix, indexRouter);

sequelize
    .sync()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`http://localhost:${PORT}`);
        });
    })
    .catch((err) => console.log(err));
