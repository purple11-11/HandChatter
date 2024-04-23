const Sequelize = require("sequelize");

console.log(process.env.NODE_ENV); // development or production

let config;
if (process.env.NODE_ENV) {
    config = require(__dirname + "/../config/config.js")[process.env.NODE_ENV];
} else {
    config = require(__dirname + "/../config/config.js")["development"];
}
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const TutorModel = require("../models/Tutor")(sequelize, Sequelize);
const StudentModel = require("../models/Student")(sequelize, Sequelize);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Tutor = TutorModel;
db.Student = StudentModel;

module.exports = db;
