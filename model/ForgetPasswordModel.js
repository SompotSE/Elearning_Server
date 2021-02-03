module.exports = (sequelize, Sequelize) => {
    const ForgetPassword = sequelize.define(
        'forgetpassword',
        {
            forgetpasswordId: {
                type: Sequelize.INTEGER,
                field: 'forgetpasswordId',
                primaryKey: true
            },
            userId: {
                type: Sequelize.INTEGER,
                field: 'userId'
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
    return ForgetPassword;
};