const express = require('express');
const db = require('../util/db.config');
const authorization = require('../util/authorization');
const authorizationadmin = require('../util/authorizationadmin');
const { QueryTypes } = require('sequelize');

const sequelize = db.sequelize;
const UserExaminationModel = db.UserExaminationModel
const route = express.Router();

route.get('/ExamPost/:CourseCode/:Number', authorization.authorization, async (req, res, next) => {
    const courseCode = req.params.CourseCode;
    const Num = parseInt(req.params.Number);
    var exampost = [];
    var query = `SELECT examinationlistCode,examinationlistText,courseCode,'' as answer FROM examinationlist WHERE courseCode = :courseCode ORDER BY RAND () LIMIT :Num`;
    exampost = await sequelize.query(query, { replacements: { courseCode: courseCode, Num: Num }, type: QueryTypes.SELECT });

    await Promise.all(exampost.map(async (item) => {
        var query = `SELECT answerlistCode,answerlistText,examinationCode FROM answerlist WHERE examinationCode = :examinationCode ORDER BY RAND ()`;
        item.answerlist = await sequelize.query(query, { replacements: { examinationCode: item.examinationlistCode }, type: QueryTypes.SELECT });
    }));

    res.json({
        "status": true,
        "message": "Success",
        "data": exampost
    });
});

route.get('/ExamPost/TopScore', authorizationadmin.authorizationadmin, async (req, res, next) => {
    var topScore = [];
    var course = [];
    var query = `SELECT * FROM course`;
    course = await sequelize.query(query, { type: QueryTypes.SELECT });

    await Promise.all(course.map(async (item) => {
        var query = `SELECT 
                        b.courseCode,
                        max(b.percenScore) AS percenScore,
                        c.name,
                        c.nameCompany
                    FROM course a
                        LEFT JOIN userexamination b ON a.courseCode = b.courseCode 
                        LEFT JOIN user c ON b.userId = c.userId
                    WHERE a.courseCode = :courseCode
                    `;
        topScore.push(...await sequelize.query(query, { replacements: { courseCode: item.courseCode }, type: QueryTypes.SELECT }));
    }));

    res.json({
        "status": true,
        "message": "Success",
        "data": topScore
    });
});

route.post('/Send/Answer/ExamPost/:CourseCode/:time', authorization.authorization, async (req, res, next) => {
    const courseCode = req.params.CourseCode;
    const time = req.params.time;
    const ans = req.body;
    const userId = req.params.userId;
    const num_course = ans.length;
    var seqIns = 1;
    var score = 0;
    var percenScore = 0;
    var query = `SELECT MAX(a.seq) AS seq FROM userexamination a WHERE a.userId = :userId AND a.courseCode = 'COURSE1001' `;
    var seq = await sequelize.query(query, { replacements: { userId: userId, courseCode: courseCode }, type: QueryTypes.SELECT });

    if (seq[0].seq != null) {
        seqIns = seq[0].seq + 1;
    }

    await Promise.all(ans.map(async (item) => {
        var query2 = `SELECT COUNT(*) AS score FROM answer a WHERE a.examinationlistCode = :examinationlistCode AND a.answerlistCode = :answerlistCode`;
        var ans_score = await sequelize.query(query2, { replacements: { examinationlistCode: item.examinationlistCode, answerlistCode: item.answer }, type: QueryTypes.SELECT });
        if (ans_score[0] != null) {
            score += ans_score[0].score;
        }
    }));

    percenScore = (score * 100) / num_course;

    const dataSave = {
        "userId": userId,
        "examinationCode": "EXAM10002",
        "courseCode": courseCode,
        "percenScore": percenScore,
        "time": time,
        "seq": seqIns,
        "recStatus": "A"
    }

    const t = await sequelize.transaction();
    try {
        await UserExaminationModel.create(dataSave, { transaction: t });
        await t.commit();
        res.json({
            "status": true,
            "message": "Success",
            "data": { "percenScore": percenScore, "score": score, "num": num_course }
        });
    } catch (error) {
        await t.rollback();
        res.json({
            "status": false,
            "message": "Create Examination Error",
            "data": []
        });
    }
});

module.exports = route;