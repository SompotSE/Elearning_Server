const db = require('./db.config');
const jwt = require('jsonwebtoken');
const scretKey = require('./ScretKey');

const sequelize = db.sequelize;
const UserModel = db.UserModel;

function authorization(req, res, next) {
    jwt.verify(req.headers.token, (req.headers.key + scretKey.scretKey), async function (err, token) {
        if (token) {
            let user = {};
            user = await UserModel.findByPk(token.userId);
            // user = await UserProfile.findAll({ where: { userProfileId: token.userProfileId } });
            if (user) {
                var today = Math.floor(Date.now() / 1000);
                // var d = new Date();
                // d.setDate(d.getDate() + 8);
                // d.setHours(0, 0, 0);
                // d.setMilliseconds(0);
                // console.log(d)
                // var today = Math.floor(d / 1000);
                // console.log(today, " today");
                if (today < token.exp) {
                    console.log("Authorization Success");
                    req.params.userId = user.userId;
                    next();
                } else {
                    res.json(newUser = {
                        "status": false,
                        "message": "Authorization Expire",
                        "data": []
                    });
                }
            } else {
                res.json(newUser = {
                    "status": false,
                    "message": "Authorization Fall",
                    "data": []
                });
            }
        }
        else {
            res.json({
                "status": false,
                "message": "Authorization Wrong",
                "data": []
            });
        }
    });
}

module.exports = {
    authorization: authorization
}