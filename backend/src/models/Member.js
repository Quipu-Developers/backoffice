const {DataTypes} = require('sequelize');
const Sequelize = require("sequelize");
class Member extends Sequelize.Model {
    static initiate(sequelize) {
        Member.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            }, // PK 용
            name: {
                type: DataTypes.STRING,
                allowNull: false
            }, // 이름
            grade: {
                type: DataTypes.INTEGER,
                allowNull: false
            }, // 학년
            student_id: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            }, // 학번
            major: {
                type: DataTypes.STRING,
                allowNull: false
            }, // 학과
            phone_number: {
                type: DataTypes.STRING,
                allowNull: false
            }, // 전화번호
            // 원하는 활동
            semina: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            }, // 세미나
            dev: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            }, // 개발
            study: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            }, // 스터디
            external: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            }, // 대외활동
            motivation_semina: {
                type: DataTypes.TEXT,
                allowNull: true
            }, // 세미나 선택 시 작성
            field_dev: {
                type: DataTypes.TEXT,
                allowNull: true
            }, // 개발 선택 시 분야 선택
            motivation_study: {
                type: DataTypes.TEXT,
                allowNull: true
            }, // 스터디 선택 시 작성
            motivation_external: {
                type: DataTypes.TEXT,
                allowNull: true
            }, // 대외활동 선택 시 작성
            portfolio_pdf: {
                type: DataTypes.STRING,
                allowNull: true
            }, // pdf 이름
            github_profile: {
                type: DataTypes.STRING,
                allowNull: false
            }, // 깃허브 프로필 주소
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: "Member",
            tableName: "members",
            paranoid: false,
            charset: "utf8mb4",
            collate: "utf8mb4_general_ci"
        });
    }
}

module.exports = Member;
