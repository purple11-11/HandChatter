const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT;
const http = require("http");
const { sequelize } = require("./models");
const indexRouter = require("./routes");
const authRouter = require("./routes/auth");
const serverPrefix = "/api";
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const passportConfig = require("./passport");
passportConfig(passport);
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

// passport 설정
app.use(passport.initialize());
app.use(passport.session()); //(req.session 객체는 express-session에서 생성하는 것이므로 passport 미들웨어는 express-session 미들웨어보다 뒤에 연결해야 합니다.)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/uploads", express.static(__dirname + "/uploads"));

// route 설정
app.use(serverPrefix, indexRouter);
app.use("/auth", authRouter);

sequelize
    .sync({ force: false })
    .then(() => {
        server.listen(PORT, () => {
            console.log(`http://localhost:${PORT}/api`);
        });
    })
    .catch((err) => console.log(err));
