const express = require('express');
const db = require('../util/db.config');
const authorization = require('../util/authorization');
const { QueryTypes } = require('sequelize');

const sequelize = db.sequelize;
const UserTopicModel = db.UserTopicModel;
const route = express.Router();

route.get('/find/:courseCode', authorization.authorization, async (req, res, next) => {
    const courseCode = req.params.courseCode;
    const userId = req.params.userId;
    const usercourse = await UserTopicModel.findAll({ where: { courseCode: courseCode, userId: userId ,recStatus: "A" } });
    // res.json(usercourse);
    res.json({
        "status": true,
        "message": "Success",
        "data": usercourse
    });
});

// route.put('/find/all', authorization.authorization, async (req, res, next) => {
//     var alltopic = [];
//     var query = `SELECT a.courseCode,COUNT(*) as count FROM topic a GROUP BY a.courseCode`;
//     alltopic = await sequelize.query(query, { type: QueryTypes.UPDATE });
//     res.json({
//         "status": true,
//         "message": "Success",
//         "data": alltopic
//     });
// });

route.get('/find/all/user', authorization.authorization, async (req, res, next) => {
    const userId = req.params.userId;
    var alltopicuser = [];
    var query = `SELECT 
                    z.courseCode,
                    SUM(z.countall) AS countall,
                    SUM(z.countuser) AS countuser 
                FROM (SELECT a.courseCode,COUNT(*) as countall, 0 AS countuser FROM topic a GROUP BY a.courseCode
                    UNION
                    SELECT b.courseCode,0 AS countall,COUNT(*) as countuser FROM usertopic b WHERE b.userId = :userId GROUP BY b.courseCode ) z 
                GROUP BY z.courseCode
                `;
    alltopicuser = await sequelize.query(query, { replacements: { userId: userId }, type: QueryTypes.SELECT });
    res.json({
        "status": true,
        "message": "Success",
        "data": alltopicuser
    });
});

route.post('/create', authorization.authorization, async (req, res, next) => {
    const topicCreate = req.body;
    topicCreate.userId = req.params.userId;
    const t = await sequelize.transaction();
        try {
            await UserTopicModel.create(topicCreate, { transaction: t });
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
                "message": "Create Topic Error",
                "data": []
            });
        }
});

route.put('/update/time/:courseCode/:topicCode', authorization.authorization, async (req, res, next) => {
    const courseCode = req.params.courseCode;
    const topicCode = req.params.topicCode;
    const userId = req.params.userId;
    const time = req.body;
    var view = [];
    var query = `UPDATE usertopic SET TIME = (TIME + :time ) WHERE courseCode = :courseCode AND topicCode = :topicCode AND userId = :userId`;
    view = await sequelize.query(query, { replacements: { time: time.time, courseCode: courseCode, topicCode: topicCode, userId: userId }, type: QueryTypes.UPDATE });
    // await UserCourseModel.update(courseUpdate, { where: { userId: userId, courseCode: courseCode, recStatus: "A" }, transaction: t });
    res.json({
        "status": true,
        "message": "Success",
        "data": view
    });
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