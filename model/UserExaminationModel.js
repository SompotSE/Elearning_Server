module.exports = (sequelize, Sequelize) => {
    const UserExamination = sequelize.define(
        'userexamination',
        {
            userexaminationId: {
                type: Sequelize.INTEGER,
                field: 'userexaminationId',
                primaryKey: true
            },
            courseCode: {
                type: Sequelize.STRING,
                field: 'courseCode'
            },
            examinationCode: {
                type: Sequelize.STRING,
                field: 'examinationCode'
            },
            userId: {
                type: Sequelize.INTEGER,
                field: 'userId'
            },
            percenScore: {
                type: Sequelize.INTEGER,
                field: 'percenScore'
            },
            time: {
                type: Sequelize.INTEGER,
                field: 'time'
            },
            seq: {
                type: Sequelize.INTEGER,
                field: 'seq'
            },
            recStatus: {
                type: Sequelize.STRING,
                field: 'recStatus'
            },
            createDate: {
                type: 'TIMESTAMP',
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                field: 'createDate'
            },
            updateDate: {
                type: 'TIMESTAMP',
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                field: 'updateDate'
            }
        },
        {
            timestamps: false,
            freezeTableName: true
        }
    );
    return UserExamination;
};