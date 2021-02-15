const db = require('./db.config');
const jwt = require('jsonwebtoken');
const scretKey = require('./ScretKey');

const sequelize = db.sequelize;
const UserModel = db.UserModel;

function authorizationadmin(req, res, next) {
    jwt.verify(req.headers.token, (req.headers.key + scretKey.scretKey), async function (err, token) {
        if (token) {
            let user = {};
            user = await UserModel.findByPk(token.userId);
            if (user.userCode == "Admin311263") {
                var today = Math.floor(Date.now() / 1000);
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
    authorizationadmin: authorizationadmin
}