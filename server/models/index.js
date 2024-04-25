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
const LevelModel = require("../models/Level")(sequelize, Sequelize);
const FavoritesModel = require("../models/Favorites")(sequelize, Sequelize);
const MessageModel = require("../models/Message")(sequelize, Sequelize);
const ReviewModel = require("../models/Review")(sequelize, Sequelize);

// 1 대 N 관계설정
// 강사 : 레벨
TutorModel.hasMany(LevelModel, {
    onDelete: "CASCADE",
    foreignKey: {
        name: "tutor_idx",
        allowNull: false,
    },
});
// 강사 : 찜
TutorModel.hasMany(FavoritesModel, {
    onDelete: "CASCADE",
    foreignKey: {
        name: "tutor_idx",
        allowNull: false,
    },
});
// 강사 : 리뷰
TutorModel.hasMany(ReviewModel, {
    onDelete: "CASCADE",
    foreignKey: {
        name: "tutor_idx",
        allowNull: false,
    },
});
// 강사 : 메시지
TutorModel.hasMany(MessageModel, {
    onDelete: "CASCADE",
    foreignKey: {
        name: "tutor_idx",
        allowNull: false,
    },
});
// 학생 : 찜
StudentModel.hasMany(FavoritesModel, {
    onDelete: "CASCADE",
    foreignKey: {
        name: "stu_idx",
        allowNull: false,
    },
});
// 학생 : 메시지
StudentModel.hasMany(MessageModel, {
    onDelete: "CASCADE",
    foreignKey: {
        name: "stu_idx",
        allowNull: false,
    },
});
// 학생 : 리뷰
StudentModel.hasMany(ReviewModel, {
    onDelete: "CASCADE",
    foreignKey: {
        name: "stu_idx",
        allowNull: false,
    },
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Tutor = TutorModel;
db.Student = StudentModel;
db.Level = LevelModel;
db.Favorites = FavoritesModel;
db.Message = MessageModel;
db.ReviewModel = ReviewModel;

module.exports = db;
