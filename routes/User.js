const express = require('express');
const db = require('../util/db.config');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const scretKey = require('../util/ScretKey');
const authorization = require('../util/authorization');
const moment = require('moment-timezone');

const { QueryTypes } = require('sequelize');

const sequelize = db.sequelize;
const UserModel = db.UserModel;
const route = express.Router();

route.get('/', async (req, res, next) => {
    res.send('Users Page')
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
        text: "ยืนยันสมัครสมาชิก คือ " + genid, // plain text body
        html: "<b>ยืนยันสมัครสมาชิก คือ " + genid + "</b>" // html body
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