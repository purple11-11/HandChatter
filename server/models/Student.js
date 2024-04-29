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
                allowNull: true,
            },
            provider: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            profile_img: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            authority: {
                type: DataTypes.TINYINT, //튜터로 임명할지 안할지에 대한 권한 여부, 관리자가 관리(0/1로 담김)
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            tableName: "student",
            freezeTableName: true,
            timestamps: false,
        }
    );
};

module.exports = Student;
