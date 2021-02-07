const express = require('express');
const db = require('../util/db.config');
const authorization = require('../util/authorization');
const { QueryTypes } = require('sequelize');

const sequelize = db.sequelize;
const UserCourseModel = db.UserCourseModel;
const route = express.Router();

route.get('/find/:courseCode', authorization.authorization, async (req, res, next) => {
    const courseCode = req.params.courseCode;
    const userId = req.params.userId;
    const usercourse = await UserCourseModel.findAll({ where: { courseCode: courseCode, userId: userId, recStatus: "A" } });
    // res.json(usercourse);
    res.json({
        "status": true,
        "message": "Success",
        "data": usercourse
    });
});

route.put('/update/:courseCode', authorization.authorization, async (req, res, next) => {
    const courseCode = req.params.courseCode;
    const userId = req.params.userId;
    const courseUpdate = req.body;
    const t = await sequelize.transaction();
    try {
        await UserCourseModel.update(courseUpdate, { where: { userId: userId, courseCode: courseCode, recStatus: "A" }, transaction: t });
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
            "message": "Update Course Error",
            "data": []
        });
    }
});

route.put('/update/time/:courseCode', authorization.authorization, async (req, res, next) => {
    const courseCode = req.params.courseCode;
    const userId = req.params.userId;
    const time = req.body;
    var view = [];
    var query = `UPDATE usercourse SET TIME = (TIME + :time ) WHERE courseCode = :courseCode AND userId = :userId`;
    view = await sequelize.query(query, { replacements: { time: time.time, courseCode: courseCode, userId: userId }, type: QueryTypes.UPDATE });
    // await UserCourseModel.update(courseUpdate, { where: { userId: userId, courseCode: courseCode, recStatus: "A" }, transaction: t });
    res.json({
        "status": true,
        "message": "Success",
        "data": view
    });
});

route.post('/create', authorization.authorization, async (req, res, next) => {
    const courseCreate = req.body;
    courseCreate.userId = req.params.userId;
    const usercourse = await UserCourseModel.findAll({ where: { courseCode: courseCreate.courseCode, userId: courseCreate.userId, recStatus: "A" } });
    if (usercourse.length <= 0) {
        const t = await sequelize.transaction();
        try {
            await UserCourseModel.create(courseCreate, { transaction: t });
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
                "message": "Create Course Error",
                "data": []
            });
        }
    } else {
        res.json({
            "status": true,
            "message": "Have this Course",
            "data": []
        });
    }
});

// route.get('/find/Admin/all', authorization.authorization, async (req, res, next) => {
//     const catalog = await Catalog.findAll({ where: { catStatus: "A" } });
//     res.json(catalog);
// });

// route.post('/create', authorization.authorization, async (req, res, next) => {
//     const catalog = req.body;
//     let catalogCobeId = {};
//     var query = `SELECT * FROM catalog ORDER BY catId DESC LIMIT 1`;
//     catalogCobeId = await sequelize.query(query, { type: QueryTypes.SELECT });
//     const catCodeOld = catalogCobeId[0].catCode;
//     const number = catCodeOld.substring(3);
//     const catCode = "CAT" + (parseInt(number) + 1);
//     catalog.catCode = catCode;
//     let newCatalog = null;
//     if (catalog) {
//         newCatalog = await sequelize.transaction(function (t) {
//             return Catalog.create(catalog, { transaction: t });
//         });
//     }
//     res.json(newCatalog);
// });

module.exports = route;