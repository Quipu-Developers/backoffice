const { DataTypes } = require("sequelize");
const Sequelize = require('sequelize');

class Dev_member extends Sequelize.Model {
    static initiate(sequelize) {
        Dev_member.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                student_id: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true,
                },
                major: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                phone_number: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                department: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                motivation: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                project_description: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                portfolio_pdf: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                github_profile: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                github_email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                slack_email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                willing_general_member: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                },
            },
            {
                sequelize,
                timestamps: true,
                underscored: true,
                modelName: "Dev_member",
                tableName: "dev_members",
                paranoid: false,
                charset: "utf8mb4",
                collate: "utf8mb4_general_ci",
            }
        );
    }
}

module.exports = Dev_member;
