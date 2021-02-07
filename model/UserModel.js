module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define(
        'user',
        {
            userId: {
                type: Sequelize.INTEGER,
                field: 'userId',
                primaryKey: true
            },
            userCode: {
                type: Sequelize.STRING,
                field: 'userCode'
            },
            name: {
                type: Sequelize.STRING,
                field: 'name'
            },
            phone: {
                type: Sequelize.STRING,
                field: 'phone'
            },
            nameCompany: {
                type: Sequelize.STRING,
                field: 'nameCompany'
            },
            email: {
                type: Sequelize.STRING,
                field: 'email'
            },
            password: {
                type: Sequelize.STRING,
                field: 'password'
            },
            sendNewsEmail: {
                type: Sequelize.STRING,
                field: 'sendNewsEmail'
            },
            userRoleId: {
                type: Sequelize.INTEGER,
                field: 'userRoleId'
            },
            confirmRegisterKey: {
                type: Sequelize.STRING,
                field: 'confirmRegisterKey'
            },
            confirmRegister: {
                type: Sequelize.STRING,
                field: 'confirmRegister'
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
    return User;
};