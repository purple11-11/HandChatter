const Message = function (Sequelize, DataTypes) {
    return Sequelize.define(
        "Message",
        {
            msg_idx: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            content: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            room_num: {
                type: DataTypes.INTEGER,
            },
        },
        {
            tableName: "message",
            freezeTableName: true,
            timestamps: false,
        }
    );
};

module.exports = Message;
