const express = require("express");
const app = express();
const dotenv = require("dotenv");
const http = require("http");
const { sequelize } = require("./models");
const indexRouter = require("./routes");
const serverPrefix = "/api";
const cors = require("cors");
const server = http.createServer(app);
const { swaggerUi, specs } = require("./swagger/swagger");
const socketHadnler = require("./sockets");

// socketHadnler(server);
dotenv.config();
const PORT = process.env.PORT;

// body-parser 설정
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// route 설정
app.use(serverPrefix, indexRouter);

sequelize
    .sync({ force: false })
    .then(() => {
        server.listen(PORT, () => {
            console.log(`http://localhost:${PORT}`);
        });
    })
    .catch((err) => console.log(err));
