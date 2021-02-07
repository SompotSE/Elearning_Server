const express = require('express');
const db = require('../util/db.config');
const authorization = require('../util/authorization');
const { QueryTypes } = require('sequelize');

const sequelize = db.sequelize;
const UserExaminationModel = db.UserExaminationModel;
const route = express.Router();

route.get('/find/:courseCode/:examinationCode', authorization.authorization, async (req, res, next) => {
    const courseCode = req.params.courseCode;
    const examinationCode = req.params.examinationCode;
    const userId = req.params.userId;
    const userexam = await UserExaminationModel.findAll({ where: { courseCode: courseCode, examinationCode: examinationCode, userId: userId, recStatus: "A" } });
    // res.json(usercourse);
    res.json({
        "status": true,
        "message": "Success",
        "data": userexam
    });
});

// route.post('/create', authorization.authorization, async (req, res, next) => {
//     const topicCreate = req.body;
//     topicCreate.userId = req.params.userId;
//     const t = await sequelize.transaction();
//         try {
//             await UserTopicModel.create(topicCreate, { transaction: t });
//             await t.commit();
//             res.json({
//                 "status": true,
//                 "message": "Success",
//                 "data": []
//             });
//         } catch (error) {
//             await t.rollback();
//             res.json({
//                 "status": false,
//                 "message": "Create Topic Error",
//                 "data": []
//             });
//         }
// });

module.exports = route;