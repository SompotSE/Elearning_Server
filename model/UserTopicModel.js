module.exports = (sequelize, Sequelize) => {
    const UserTopic = sequelize.define(
        'usertopic',
        {
            usertopicId: {
                type: Sequelize.INTEGER,
                field: 'usertopicId',
                primaryKey: true
            },
            courseCode: {
                type: Sequelize.STRING,
                field: 'courseCode'
            },
            topicCode: {
                type: Sequelize.STRING,
                field: 'topicCode'
            },
            userId: {
                type: Sequelize.INTEGER,
                field: 'userId'
            },
            time: {
                type: Sequelize.INTEGER,
                field: 'time'
            },
            videoStatus: {
                type: Sequelize.STRING,
                field: 'videoStatus'
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
    return UserTopic;
};