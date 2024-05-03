const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT;
const http = require("http");
const { sequelize } = require("./models");
const indexRouter = require("./routes");
const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const serverPrefix = "/api";
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const passportConfig = require("./passport");
passportConfig(passport);
const server = http.createServer(app);
const { swaggerUi, specs } = require("./modules/swagger/swagger");
const socketHandler = require("./sockets");
socketHandler(server);
// const socketWebRTC = require("./modules/webrtc/webrtc");
// socketWebRTC(server);

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
};

// cors 설정 및 세션 설정 (body-parser 이전에 위치해야 함)
app.use(cors(corsOptions));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
        },
    })
);

// body-parser 설정
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// passport 설정
app.use(passport.initialize());
app.use(passport.session()); //(req.session 객체는 express-session에서 생성하는 것이므로 passport 미들웨어는 express-session 미들웨어보다 뒤에 연결해야 합니다.)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use("/public", express.static(__dirname + "/public"));

// route 설정
app.use(serverPrefix, indexRouter);
app.use("/auth", authRouter);
app.use("/admin", adminRouter);

sequelize
    .sync({ force: false })
    .then(() => {
        server.listen(PORT, () => {
            console.log(`http://localhost:${PORT}/api`);
        });
    })
    .catch((err) => console.log(err));
