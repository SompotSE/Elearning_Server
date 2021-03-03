
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));
app.use(express.static('video'));

const user = require('./routes/User');
const forgetpassword = require('./routes/ForgetPassword');
const usercourse = require('./routes/UserCourse');
const usertopic = require('./routes/UserTopic');
const userexamination = require('./routes/UserExamination');

const examination = require('./routes/Examination');
const userAssessment = require('./routes/UserAssessment')

app.use('/User', user);
app.use('/ForgetPassword', forgetpassword);
app.use('/UserCourse', usercourse);
app.use('/UserTopic', usertopic);
app.use('/UserExamination', userexamination);
app.use('/Examination', examination);
app.use('/UserAssessment', userAssessment);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));