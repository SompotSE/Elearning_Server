const express = require('express');
const db = require('../util/db.config');
const authorization = require('../util/authorization');
const authorizationadmin = require('../util/authorizationadmin');
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

route.get('/find', authorizationadmin.authorizationadmin, async (req, res, next) => {
    var query1 = `SELECT a.userId,MAX(a.percenScore) AS percenScore FROM userexamination a WHERE a.courseCode = 'COURSE1001' GROUP BY a.userId HAVING MAX(a.percenScore) >= 80`;
    var query2 = `SELECT a.userId,MAX(a.percenScore) AS percenScore FROM userexamination a WHERE a.courseCode = 'COURSE1001' GROUP BY a.userId HAVING MAX(a.percenScore) < 80`;
    var course1Pass = await sequelize.query(query1, { type: QueryTypes.SELECT });
    var course1Fail = await sequelize.query(query2, { type: QueryTypes.SELECT });

    var query3 = `SELECT a.userId,MAX(a.percenScore) AS percenScore FROM userexamination a WHERE a.courseCode = 'COURSE1002' GROUP BY a.userId HAVING MAX(a.percenScore) >= 80`;
    var query4 = `SELECT a.userId,MAX(a.percenScore) AS percenScore FROM userexamination a WHERE a.courseCode = 'COURSE1002' GROUP BY a.userId HAVING MAX(a.percenScore) < 80`;
    var course2Pass = await sequelize.query(query3, { type: QueryTypes.SELECT });
    var course2Fail = await sequelize.query(query4, { type: QueryTypes.SELECT });

    var query5 = `SELECT a.userId,MAX(a.percenScore) AS percenScore FROM userexamination a WHERE a.courseCode = 'COURSE1003' GROUP BY a.userId HAVING MAX(a.percenScore) >= 80`;
    var query6 = `SELECT a.userId,MAX(a.percenScore) AS percenScore FROM userexamination a WHERE a.courseCode = 'COURSE1003' GROUP BY a.userId HAVING MAX(a.percenScore) < 80`;
    var course3Pass = await sequelize.query(query5, { type: QueryTypes.SELECT });
    var course3Fail = await sequelize.query(query6, { type: QueryTypes.SELECT });

    var query7 = `SELECT a.userId,MAX(a.percenScore) AS percenScore FROM userexamination a WHERE a.courseCode = 'COURSE1004' GROUP BY a.userId HAVING MAX(a.percenScore) >= 80`;
    var query8 = `SELECT a.userId,MAX(a.percenScore) AS percenScore FROM userexamination a WHERE a.courseCode = 'COURSE1004' GROUP BY a.userId HAVING MAX(a.percenScore) < 80`;
    var course4Pass = await sequelize.query(query7, { type: QueryTypes.SELECT });
    var course4Fail = await sequelize.query(query8, { type: QueryTypes.SELECT });

    var query9 = `SELECT a.userId,MAX(a.percenScore) AS percenScore FROM userexamination a WHERE a.courseCode = 'COURSE1005' GROUP BY a.userId HAVING MAX(a.percenScore) >= 80`;
    var query10 = `SELECT a.userId,MAX(a.percenScore) AS percenScore FROM userexamination a WHERE a.courseCode = 'COURSE1005' GROUP BY a.userId HAVING MAX(a.percenScore) < 80`;
    var course5Pass = await sequelize.query(query9, { type: QueryTypes.SELECT });
    var course5Fail = await sequelize.query(query10, { type: QueryTypes.SELECT });
    
    var data = {
        "course1pass": course1Pass.length,
        "course1fail": course1Fail.length,
        "course2pass": course2Pass.length,
        "course2fail": course2Fail.length,
        "course3pass": course3Pass.length,
        "course3fail": course3Fail.length,
        "course4pass": course4Pass.length,
        "course4fail": course4Fail.length,
        "course5pass": course5Pass.length,
        "course5fail": course5Fail.length
    }

    res.json({
        "status": true,
        "message": "Success",
        "data": data
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