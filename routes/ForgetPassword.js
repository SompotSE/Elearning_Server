const express = require('express');
const db = require('../util/db.config');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const authorization = require('../util/authorization');
const { QueryTypes } = require('sequelize');

const sequelize = db.sequelize;
const UserModel = db.UserModel;
const ForgetPasswordModel = db.ForgetPasswordModel;
const route = express.Router();

route.get('/', async (req, res, next) => {
    res.send('Users Page')
});

route.post('/ForgetPassword', async (req, res, next) => {
    const user = req.body;
    if (user.email) {
        UserModel.findAll({ where: { email: user.email, recStatus: "A" } })
            .then(async (userEmail) => {
                if (userEmail.length > 0) {
                    var genid = await makeid(8);
                    console.log(genid, " genidgenidgenid");
                    bcrypt.hash(genid, 10)
                        .then((hash) => {
                            const forget = {
                                "userId": userEmail[0].userId,
                                "recStatus": "A"
                            }
                            ForgetPasswordModel.create(forget)
                                .then((forgetpass) => {
                                    UserModel.update(
                                        { "password": hash, "updateDate": moment().tz("Asia/Bangkok").format() },
                                        { where: { userId: userEmail[0].userId } }
                                    ).then((userupdate) => {
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
                                                "message": "Not Update Password",
                                                "data": []
                                            });
                                        });
                                })
                                .catch((error) => {
                                    res.json({
                                        "status": false,
                                        "message": "Not Create Forget Password",
                                        "data": []
                                    });
                                });
                        })
                        .catch((error) => {
                            console.log(error, " error")
                            res.json({
                                "status": false,
                                "message": "Error Gen Password",
                                "data": []
                            });
                        })
                } else {
                    res.json({
                        "status": false,
                        "message": "Email Not Already",
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
        from: '"Reset Password" <They2539@gmail.com>',
        to: email, // list of receivers
        subject: "เปลี่ยนรหัสผ่าน", // Subject line
        text: "รหัสผ่านใหม่ของคุณ คือ " + genid, // plain text body
        html: "<b>รหัสผ่านใหม่ของคุณ คือ " + genid + "</b>" // html body
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