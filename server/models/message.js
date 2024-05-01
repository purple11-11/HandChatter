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
            sender: {
                type: DataTypes.STRING(10),
                allowNull: false,
            },
            receiver: {
                type: DataTypes.STRING(10),
                allowNull: false,
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
