const Review = function (Sequelize, DataTypes) {
    return Sequelize.define(
        "Review",
        {
            review_idx: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            content: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            rating: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: "review",
            freezeTableName: true,
            timestamps: true,
            createdAt: true,
            createdAt: "created_at",
            updatedAt: false,
        }
    );
};

module.exports = Review;
