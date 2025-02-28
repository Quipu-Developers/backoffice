const {DataTypes} = require('sequelize');
const Sequelize = require("sequelize");

class Feature extends Sequelize.Model {
    static initiate(sequelize) {
        Feature.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            }, // ID
            feature_name: {
                type: DataTypes.STRING,
                allowNull: false
            }, // 이름
            is_enabled: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            }, // on/off
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: "Feature",
            tableName: "features",
            paranoid: false,
            charset: "utf8mb4",
            collate: "utf8mb4_general_ci"
        });
    }
}

module.exports = Feature;
