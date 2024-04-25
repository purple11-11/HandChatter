const express = require("express");
const app = express();
const dotenv = require("dotenv");
const http = require("http");
const { sequelize } = require("./models");
const indexRouter = require("./routes");
const serverPrefix = "/api";
const cors = require("cors");
const session = require("express-session");
const server = http.createServer(app);
const { swaggerUi, specs } = require("./modules/swagger/swagger");
const socketHadnler = require("./modules/sockets");
// socketHandler(server);

// body-parser 설정
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
    session({
        secret: "secretKey",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
        },
    })
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/uploads", express.static(__dirname + "/uploads"));

// route 설정
app.use(serverPrefix, indexRouter);

sequelize
    .sync({ force: false })
    .then(() => {
        server.listen(PORT, () => {
            console.log(`http://localhost:${PORT}/api`);
        });
    })
    .catch((err) => console.log(err));
