const Student = function (Sequelize, DataTypes) {
    return Sequelize.define(
        "Student",
        {
            stu_idx: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            id: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            nickname: {
                type: DataTypes.STRING(10),
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING(50),
                allowNull: null,
            },
            provider: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
        },
        {
            tableName: "student",
            freezeTableName: true,
            timestamps: true,
        }
    );
};

module.exports = Student;
