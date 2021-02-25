module.exports = (sequelize, Sequelize) => {
    const UserAssessment = sequelize.define(
        'userassessment',
        {
            userAssessmentId: {
                type: Sequelize.INTEGER,
                field: 'userAssessmentId',
                primaryKey: true
            },
            time: {
                type: Sequelize.DATE,
                field: 'time'
            },
            place: {
                type: Sequelize.STRING,
                field: 'place'
            },
            know: {
                type: Sequelize.STRING,
                field: 'know'
            },
            knowOther: {
                type: Sequelize.STRING,
                field: 'knowOther'
            },
            source1: {
                type: Sequelize.STRING,
                field: 'source1'
            },
            source2: {
                type: Sequelize.STRING,
                field: 'source2'
            },
            source3: {
                type: Sequelize.STRING,
                field: 'source3'
            },
            source4: {
                type: Sequelize.STRING,
                field: 'source4'
            },
            source5: {
                type: Sequelize.STRING,
                field: 'source5'
            },
            source6: {
                type: Sequelize.STRING,
                field: 'source6'
            },
            source7: {
                type: Sequelize.STRING,
                field: 'source7'
            },
            source8: {
                type: Sequelize.STRING,
                field: 'source8'
            },
            comment3: {
                type: Sequelize.STRING,
                field: 'comment3'
            },
            source9: {
                type: Sequelize.STRING,
                field: 'source9'
            },
            source10: {
                type: Sequelize.STRING,
                field: 'source10'
            },
            source11: {
                type: Sequelize.STRING,
                field: 'source11'
            },
            source12: {
                type: Sequelize.STRING,
                field: 'source12'
            },
            source13: {
                type: Sequelize.STRING,
                field: 'source13'
            },
            comment1: {
                type: Sequelize.STRING,
                field: 'comment1'
            },
            sourcepor: {
                type: Sequelize.STRING,
                field: 'sourcepor'
            },
            sourceporDesc: {
                type: Sequelize.STRING,
                field: 'sourceporDesc'
            },
            source14: {
                type: Sequelize.STRING,
                field: 'source14'
            },
            source15: {
                type: Sequelize.STRING,
                field: 'source15'
            },
            source16: {
                type: Sequelize.STRING,
                field: 'source16'
            },
            source17: {
                type: Sequelize.STRING,
                field: 'source17'
            },
            source18: {
                type: Sequelize.STRING,
                field: 'source18'
            },
            source19: {
                type: Sequelize.STRING,
                field: 'source19'
            },
            comment2: {
                type: Sequelize.STRING,
                field: 'comment2'
            },
            courseCode: {
                type: Sequelize.STRING,
                field: 'courseCode'
            },
            userId: {
                type: Sequelize.STRING,
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
    return UserAssessment;
};