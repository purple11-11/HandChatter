const Tutor = function (Sequelize, DataTypes) {
    return Sequelize.define(
        "Tutor",
        {
            tutor_idx: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            id: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING(255), //강사 소개
                allowNull: false,
            },
            auth: {
                type: DataTypes.STRING(255), // 자격증 사진 저장
                allowNull: false,
            },
            authority: {
                type: DataTypes.TINYINT, //튜터로 임명할지 안할지에 대한 권한 여부, 관리자가 관리(0/1로 담김)
                allowNull: false,
            },
        },
        {
            tableName: "tutor",
            freezeTableName: true,
            timestamps: true,
        }
    );
};

module.exports = Tutor;
