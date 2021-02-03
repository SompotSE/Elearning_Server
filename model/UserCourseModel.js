module.exports = (sequelize, Sequelize) => {
    const UserCourse = sequelize.define(
        'usercourse',
        {
            usercourseId: {
                type: Sequelize.INTEGER,
                field: 'usercourseId',
                primaryKey: true
            },
            userId: {
                type: Sequelize.INTEGER,
                field: 'userId'
            },
            downlodeDoc: {
                type: Sequelize.STRING,
                field: 'downlodeDoc'
            },
            time: {
                type: Sequelize.INTEGER,
                field: 'time'
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
    return UserCourse;
};