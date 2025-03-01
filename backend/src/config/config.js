const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});

const config = {
  development: {
    username: process.env.DEV_DB_USER,
    password: process.env.DEV_DB_PASSWORD,
    database: process.env.DEV_DB_NAME,
    host: process.env.DEV_DB_HOST,
    dialect: "mysql",
    port: process.env.DEV_DB_PORT || 3306,
    logging: false,
  },
  test: {
    username: process.env.TEST_DB_USER,
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DB_NAME,
    host: process.env.TEST_DB_HOST,
    dialect: "mysql",
    port: process.env.TEST_DB_PORT || 3306,
    logging: false,
  },
  production: {
    username: process.env.PROD_DB_USER,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOST,
    dialect: "mysql",
    port: process.env.PROD_DB_PORT || 3306,
    logging: false,
  },
};

// ✅ 현재 NODE_ENV 값에 따라 설정 선택
const currentConfig = config[process.env.NODE_ENV];

module.exports = currentConfig;
