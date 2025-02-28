const {DataTypes} = require('sequelize');
const Sequelize = require("sequelize");

class File extends Sequelize.Model {
    static initiate(sequelize) {
        File.init({
            file_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            }, // 파일 ID
            file_name: {
                type: DataTypes.STRING,
                allowNull: false
            }, // 파일 이름 (example1.png, example2.jpg, example3.pdf 등)
            semina_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: "File",
            tableName: "files",
            paranoid: false,
            charset: "utf8mb4",
            collate: "utf8mb4_general_ci"
        });
    }
    static associate(db) {
        db
            .File
            .belongsTo(db.Semina, {
                foreignKey: 'semina_id',
                targetKey: 'semina_id'
            });
    }
}

module.exports = File;
