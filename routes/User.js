const express = require('express');
const db = require('../util/db.config');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const scretKey = require('../util/ScretKey');
const authorization = require('../util/authorization');
const authorizationadmin = require('../util/authorizationadmin');
const moment = require('moment-timezone');

const { QueryTypes } = require('sequelize');

const sequelize = db.sequelize;
const UserModel = db.UserModel;
const route = express.Router();

route.get('/', async (req, res, next) => {
    res.send('Users Page')
});

route.put('/count', async (req, res, next) => {
    var view = [];
    var query = `UPDATE count SET countrow = countrow+1 WHERE countId = 1`;
    view = await sequelize.query(query, { type: QueryTypes.UPDATE });
    res.json({
        "status": true,
        "message": "Success",
        "data": view
    });
});

route.post('/UploadImg', async (req, res, next) => {
    res.send('UploadImg')
});

route.get('/Find/All', async (req, res, next) => {
    const user = await UserModel.findAll({ where: { recStatus: "A" } });
    res.json({
        "status": true,
        "message": "Success",
        "data": user
    });
});

route.post('/Register', async (req, res, next) => {
    const user = req.body;
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    var num = Math.floor(Math.random() * 100000);
    var userCode = "U" + year.toString() + month.toString() + date.toString() + num.toString();
    if (user.email) {
        // let userName = await UserProfile.findAll({ where: { userName: user.userName } })
        UserModel.findAll({ where: { email: user.email, recStatus: "A" } })
            .then((userEmail) => {
                if (userEmail.length <= 0) {
                    // var base64Data = user.img.thumbUrl.replace(/^data:image\/png;base64,/, "");
                    // var ext = user.img.type.replace(/^image\//, "");
                    // require("fs").writeFile("./public/profile/" + user.userName + "." + ext, base64Data, 'base64',
                    //     function (err, data) {
                    //         if (err) {
                    //             console.log(err)
                    //         } else {
                    bcrypt.hash(user.password, 10)
                        .then((hash) => {
                            var genid = makeid(8);
                            user.userCode = userCode;
                            user.password = hash;
                            user.userRoleId = 2;
                            user.confirmRegisterKey = genid;
                            user.confirmRegister = "N";
                            user.recStatus = "A";
                            // user.img = user.userName + "." + ext;
                            UserModel.create(user)
                                .then((userModel) => {
                                    sendEmail(user.email, genid).catch(console.error);
                                    res.json({
                                        "status": true,
                                        "message": "Save Success",
                                        "data": []
                                    });
                                })
                                .catch((error) => {
                                    res.json({
                                        "status": false,
                                        "message": "Error",
                                        "data": []
                                    });
                                });
                        })
                        .catch((error) => {
                            res.json({
                                "status": false,
                                "message": "Error",
                                "data": []
                            });
                        })
                    // }
                    // });
                } else {
                    res.json({
                        "status": false,
                        "message": "Email Already",
                        "data": []
                    });
                }
            })
            .catch((error) => {
                res.json({
                    "status": false,
                    "message": "Error",
                    "data": []
                });
            });

    } else {
        res.json({
            "status": false,
            "message": "Plase Enter Email",
            "data": []
        });
    }
});

route.post('/Login', async (req, res, next) => {
    const user = req.body;
    let newUser = null;
    if (user.email) {
        UserModel.findAll({ where: { email: user.email, recStatus: "A" } })
            .then((userName) => {
                if (userName.length > 0) {
                    bcrypt.compare(user.password, userName[0].password)
                        .then((result) => {
                            if (!result) {
                                res.json(newUser = {
                                    "status": false,
                                    "message": "Authentication failed",
                                    "data": []
                                });
                            } else {
                                console.log(userName[0].confirmRegister, " userName[0].confirmRegister")
                                if (userName[0].confirmRegister == "A") {
                                    let scretKey2 = user.email + scretKey.scretKey;
                                    let jwtToken = jwt.sign({
                                        email: user.email,
                                        userId: userName[0].userId
                                    },
                                        scretKey2, {
                                        expiresIn: "7d"
                                    });

                                    res.cookie('token', jwtToken, { httpOnly: true });
                                    res.json({
                                        "status": true,
                                        "message": "Authentication Success",
                                        "data": {
                                            "token": jwtToken,
                                            "email": user.email,
                                            "userCode": userName[0].userCode,
                                            "name": userName[0].name,
                                            "phone": userName[0].phone,
                                            "userRoleId": userName[0].userRoleId
                                        },
                                        "expiresIn": 604800
                                    });
                                }
                                else {
                                    res.json(newUser = {
                                        "status": false,
                                        "message": "You Not Confirm Email",
                                        "data": []
                                    });
                                }
                            }
                        })
                        .catch((error) => {
                            res.json(newUser = {
                                "status": false,
                                "message": "Error",
                                "data": []
                            });
                        })
                } else {
                    res.json(newUser = {
                        "status": false,
                        "message": "Authentication failed",
                        "data": []
                    });
                }
            })
            .catch((error) => {
                res.json(newUser = {
                    "status": false,
                    "message": "Error",
                    "data": []
                });
            });
    } else {
        res.json({
            "status": false,
            "message": "Authentication failed",
            "data": []
        });
    }
});

route.post('/ChangePassword', authorization.authorization, async (req, res, next) => {
    const user = req.body;
    const userupdate = req.body;
    const userId = req.params.userId;
    let newUser = null;
    if (userId) {
        UserModel.findAll({ where: { userId: userId } })
            .then((userName) => {
                if (userName.length > 0) {
                    bcrypt.compare(user.password, userName[0].password)
                        .then((result) => {
                            if (!result) {
                                res.json({
                                    "status": false,
                                    "message": "Password Wrong",
                                    "data": []
                                });
                            } else {
                                //Save Password
                                bcrypt.hash(user.passwordNew, 10)
                                    .then((hash) => {
                                        userupdate.password = hash;
                                        userupdate.updateDate = moment().tz("Asia/Bangkok").format();
                                        UserModel.update(
                                            userupdate,
                                            { where: { userId: userName[0].userId } }
                                        ).then((userupdate) => {
                                            res.json({
                                                "status": true,
                                                "message": "Save Success",
                                                "data": []
                                            });
                                        })
                                            .catch((error) => {
                                                res.json({
                                                    "status": false,
                                                    "message": "Error",
                                                    "data": []
                                                });
                                            });
                                    })
                                    .catch((error) => {
                                        res.json({
                                            "status": false,
                                            "message": "Error",
                                            "data": []
                                        });
                                    })
                            }
                        })
                        .catch((error) => {
                            res.json({
                                "status": false,
                                "message": "Error",
                                "data": []
                            });
                        })
                }
            })
            .catch((error) => {
                res.json({
                    "status": false,
                    "message": "Error",
                    "data": []
                });
            });
    } else {
        res.json({
            "status": false,
            "message": "Not user",
            "data": []
        });
    }
});

route.get('/Admin/User/All', authorizationadmin.authorizationadmin, async (req, res, next) => {
    var user = [];
    var query = `SELECT a.userId,a.userCode,a.name,a.name as value,a.nameCompany FROM user a WHERE a.confirmRegister = 'A' AND a.userRoleId = 2`;
    user = await sequelize.query(query, { type: QueryTypes.SELECT });

    await Promise.all(user.map(async (item) => {
        var query = `SELECT 
                        z.courseCode,
                        SUM(z.countall) AS countall,
                        SUM(z.countuser) AS countuser,
                            (100 * SUM(z.countuser)) / SUM(z.countall) AS percen  
                    FROM (SELECT a.courseCode,COUNT(*) as countall, 0 AS countuser FROM topic a GROUP BY a.courseCode
                        UNION
                        SELECT b.courseCode,0 AS countall,COUNT(*) as countuser FROM usertopic b WHERE b.userId = :userId AND b.videoStatus = 'A' GROUP BY b.courseCode ) z 
                    GROUP BY z.courseCode
                    ORDER BY z.courseCode ASC`;
        item.detailTop = await sequelize.query(query, { replacements: { userId: item.userId }, type: QueryTypes.SELECT });
    }));

    res.json({
        "status": true,
        "message": "Success",
        "data": user
    });
});

route.get('/Admin/User/Viwe', authorizationadmin.authorizationadmin, async (req, res, next) => {
    var query = `SELECT COUNT(*) AS alluser FROM user`;
    var userall = await sequelize.query(query, { type: QueryTypes.SELECT });

    var query1 = `SELECT COUNT(*) AS courseuser FROM usercourse a`;
    var courseuser = await sequelize.query(query1, { type: QueryTypes.SELECT });

    var query2 = `SELECT COUNT(*) AS course1 FROM usercourse a WHERE a.courseCode = 'COURSE1001'`;
    var course1 = await sequelize.query(query2, { type: QueryTypes.SELECT });

    var query3 = `SELECT COUNT(*) AS course2 FROM usercourse a WHERE a.courseCode = 'COURSE1002'`;
    var course2 = await sequelize.query(query3, { type: QueryTypes.SELECT });

    var query4 = `SELECT COUNT(*) AS course3 FROM usercourse a WHERE a.courseCode = 'COURSE1003'`;
    var course3 = await sequelize.query(query4, { type: QueryTypes.SELECT });

    var query5 = `SELECT COUNT(*) AS course4 FROM usercourse a WHERE a.courseCode = 'COURSE1004'`;
    var course4 = await sequelize.query(query5, { type: QueryTypes.SELECT });

    var query6 = `SELECT COUNT(*) AS course5 FROM usercourse a WHERE a.courseCode = 'COURSE1005'`;
    var course5 = await sequelize.query(query6, { type: QueryTypes.SELECT });

    var query7 = 'SELECT a.userId,COUNT(*) AS pass FROM (SELECT userId,courseCode,max(percenScore) AS percenScore FROM userexamination GROUP BY userId,courseCode HAVING percenScore >= 80) a GROUP BY a.userId HAVING pass >= 5';
    var course7 = await sequelize.query(query7, { type: QueryTypes.SELECT });

    var data = {
        "userall": userall[0].alluser,
        "courseuser": courseuser[0].courseuser,
        "course1": course1[0].course1,
        "course2": course2[0].course2,
        "course3": course3[0].course3,
        "course4": course4[0].course4,
        "course5": course5[0].course5,
        "course6": course7.length
    }

    res.json({
        "status": true,
        "message": "Success",
        "data": data
    });
});

route.put('/ConfirmRegister', async (req, res, next) => {
    const confirmRegisterKey = req.body.confirmRegisterKey;
    var confirmRegister = [];
    var query = `UPDATE user SET confirmRegister = 'A' WHERE confirmRegisterKey = :confirmRegisterKey AND confirmRegister = 'N'`;
    confirmRegister = await sequelize.query(query, { replacements: { confirmRegisterKey: confirmRegisterKey }, type: QueryTypes.UPDATE });
    console.log(confirmRegister[1], " confirmRegister")
    if (confirmRegister[1] >= 1) {
        res.json({
            "status": true,
            "message": "Success",
            "data": confirmRegister
        });
    } else {
        res.json({
            "status": false,
            "message": "Error",
            "data": confirmRegister
        });
    }

});

async function sendEmail(email, genid) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'They2539@gmail.com',
            pass: '1739900645181'
        }
    });

    transporter.sendMail({
        from: '"Confirm Register" <They2539@gmail.com>',
        to: email, // list of receivers
        subject: "ยืนยันสมัครสมาชิก", // Subject line
        text: "คลิ้กลิ้งเพื่อยืนยันการสมัครสมาชิก http://localhost:3000/ConfirmRegister/" + genid, // plain text body
        html: "<b>คลิ้กลิ้งเพื่อยืนยันการสมัครสมาชิก http://localhost:3000/ConfirmRegister/" + genid + "</b>" // html body
    }, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log(info);
        }
    });
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = route;