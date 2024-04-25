const Favorites = function (Sequelize, DataTypes) {
    return Sequelize.define(
        "Favorites",
        {
            like_idx: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
        },
        {
            tableName: "favorites",
            freezeTableName: false,
            timestamps: false,
        }
    );
};

module.exports = Favorites;
