const {DataTypes} = require('sequelize');
const Sequelize = require("sequelize");
class Semina extends Sequelize.Model {
    static initiate(sequelize) {
        Semina.init({
            semina_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            }, // semina_id
            speaker: {
                type: DataTypes.STRING,
                allowNull: false
            },
            topic: {
                type: DataTypes.STRING,
                allowNUll: false
            }, // 주제
            detail: {
                type: DataTypes.TEXT,
                allowNull: false
            }, // 내용
            resources: {
                type: DataTypes.STRING,
                allowNull: true
            }, // 카드뉴스 url
            presentation_date: {
                type: DataTypes.DATE,
                allowNULL: false
            } // 발표 날짜
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: "Semina",
            tableName: "seminas",
            paranoid: false,
            charset: "utf8mb4",
            collate: "utf8mb4_general_ci"
        });
    }
    static associate(db) {
        db
            .Semina
            .hasMany(db.File, {
                foreignKey: 'semina_id',
                sourceKey: 'semina_id'
            });
    }
}

module.exports = Semina;
