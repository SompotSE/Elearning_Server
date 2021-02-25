module.exports = (sequelize, Sequelize) => {
    const Course = sequelize.define(
        'course',
        {
            courseId: {
                type: Sequelize.INTEGER,
                field: 'courseId',
                primaryKey: true
            },
            courseCode: {
                type: Sequelize.STRING,
                field: 'courseCode'
            },
            courseName: {
                type: Sequelize.STRING,
                field: 'courseName'
            },
            courseSeq: {
                type: Sequelize.INTEGER,
                field: 'courseSeq'
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
    return Course;
};