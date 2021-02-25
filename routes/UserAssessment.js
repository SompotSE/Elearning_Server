const express = require('express');
const db = require('../util/db.config');
const authorization = require('../util/authorization');
const authorizationadmin = require('../util/authorizationadmin');
const { QueryTypes } = require('sequelize');

const sequelize = db.sequelize;
const UserAssessmentModel = db.UserAssessmentModel;
const CourseModel = db.CourseModel;
const route = express.Router();

route.get('/find/:courseCode', authorization.authorization, async (req, res, next) => {
    const courseCode = req.params.courseCode;
    const userId = req.params.userId;
    const assessment = await UserAssessmentModel.findAll({ where: { courseCode: courseCode, userId: userId } });
    const course = await CourseModel.findAll({ where: { courseCode: courseCode } });
    var data = {
        "assessment" : assessment,
        "course" : course
    }
    // res.json(usercourse);
    res.json({
        "status": true,
        "message": "Success",
        "data": data
    });
});

route.post('/create', authorization.authorization, async (req, res, next) => {
    const Assessment = req.body;
    Assessment.userId = req.params.userId;
    if (Assessment) {
        const t = await sequelize.transaction();
        try {
            await UserAssessmentModel.create(Assessment, { transaction: t });
            await t.commit();
            res.json({
                "status": true,
                "message": "Success",
                "data": []
            });
        } catch (error) {
            await t.rollback();
            res.json({
                "status": false,
                "message": "Create Assessment Error",
                "data": []
            });
        }
    } else {
        res.json({
            "status": true,
            "message": "Not ve this Assessment",
            "data": []
        });
    }
});

module.exports = route;