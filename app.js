
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));

const user = require('./routes/User');
const forgetpassword = require('./routes/ForgetPassword');

app.use('/User', user);
app.use('/ForgetPassword', forgetpassword);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));