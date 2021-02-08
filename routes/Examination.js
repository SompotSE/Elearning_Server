const express = require('express');
const db = require('../util/db.config');
const authorization = require('../util/authorization');
const { QueryTypes } = require('sequelize');

const sequelize = db.sequelize;
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

module.exports = route;