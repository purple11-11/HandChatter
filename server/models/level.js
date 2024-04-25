const Level = function (Sequelize, DataTypes) {
    return Sequelize.define(
        "Level",
        {
            level_idx: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            level: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
        },
        {
            tableName: "level",
            freezeTableName: true,
            timestamps: false,
        }
    );
};

module.exports = Level;
