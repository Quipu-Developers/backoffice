const express = require("express");
const app = express();
const morgan = require("morgan");
const winston = require("winston");

//보안
const cookieParser = require("cookie-parser");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const helmet = require("helmet");
const hpp = require("hpp");
const cors = require("cors");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT;

const passportConfig = require("../src/passport");
passportConfig();

const { sequelize } = require("../src/models");
const loginRouter = require("../src/routes/login");
const memberRouter = require("../src/routes/member");
const seminaRouter = require("../src/routes/semina");

const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 2, // 2시간
    httpOnly: NODE_ENV === "production", // production이면 true, 아니면 false
    secure: NODE_ENV === "production", // production이면 true, 아니면 false
    ...(NODE_ENV === "production" && { sameSite: "None" }), // production이면 추가
  },
  ...(NODE_ENV === "production" && { proxy: true }), // production이면 추가
};

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session(sessionOption));
app.use(passport.initialize()); // req.user, req.login, req.isAuthenticate, req.logout
app.use(passport.session()); //connect.sid라는 이름으로 세션 쿠키가 브라우져로 전송
app.use(express.json());

if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN_DEV, // 클라이언트의 Origin
      methods: ["GET", "POST", "OPTIONS", "DELETE"],
      credentials: true, // 쿠키를 포함한 요청을 허용}));
    })
  );
  app.use(morgan("dev"));
  app.use(express.urlencoded({ extended: false }));
} else if (process.env.NODE_ENV === "production") {
  app.enable("trust proxy");
  app.use(morgan("combined"));
  app.use(hpp());
  app.use(express.urlencoded({ extended: false }));
  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN, // 클라이언트의 Origin
      methods: ["GET", "POST", "OPTIONS"],
      credentials: true, // 쿠키를 포함한 요청을 허용}));
    })
  );
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'none'"], // 기본적으로 모든 리소스 차단
        scriptSrc: ["'none'"], // JavaScript 실행 차단 (XSS 방지)
        styleSrc: ["'none'"], // 외부 스타일 차단
        frameSrc: ["'none'"], // iframe 포함 금지 (Clickjacking 방어)
      },
    })
  );
  app.use(helmet.frameguard({ action: "deny" }));
  app.use(helmet.noSniff());
  app.use(helmet.dnsPrefetchControl({ allow: false }));
  app.use(helmet.hidePoweredBy());
  app.use(helmet.referrerPolicy({ policy: "strict-origin-when-cross-origin" }));
}

// swagger 관련 세팅
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

async function startServer() {
  try {
    // Sequelize 연결
    await sequelize.authenticate();
    console.log("[LOG] DB 연결 성공");

    // Sequelize 테이블 동기화
    await sequelize.sync();
    console.log("[LOG] DB 연결 성공");

    // 주기적으로 DB 연결 유지
    setInterval(async () => {
      try {
        await sequelize.query("SELECT 1");
        console.log("[LOG] DB 연결 유지 로직 작동");
      } catch (err) {
        console.error("[ERROR] DB 연결 체크/유지 실패: ", err);
      }
    }, 3600000);

    // 서버 실행
    app.listen(PORT, () => {
      console.log(`PORT: ${PORT}`);
      console.log(`swagger: http://localhost:${PORT}/api-docs`);
      console.log(`server: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("DB 연결 실패:", err);
    process.exit(1);
  }
}

startServer();

//login
app.use("/bo/auth", loginRouter);

//member
app.use("/bo/member", memberRouter);

//semina
app.use("/bo/semina", seminaRouter);

//{url}/api-docs 개발시에만
if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

//error handler
const logger = winston.createLogger({
  level: "error",
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: "error.log" })],
});

app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    console.log("[ERROR] error handler 동작");
    console.error(err.stack || err);
  } else {
    logger.error(err.message || "Unexpected error"); // 운영 환경에서는 로그 파일에 저장
  }

  res.status(err.status || 500).json({
    error: { message: "Internal Server Error" },
  });
});
