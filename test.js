const moment = require("moment");

console.log("today", moment().format("YYYY-MM-DD"));
console.log("today", moment().add(1, "day").format("YYYY-MM-DD"));
console.log("today", moment().add(1, "week").format("YYYY-MM-DD"));
console.log("today", moment().add(1, "month").format("YYYY-MM-DD"));

const nodemailer = require('nodemailer');
const email = {
    "host": "",
    "port": "",
    "secure": false,
    "auth": {
        "user": "",
        "pass": ""
    }
}

const send = async (option) => {
    nodemailer.createTransport(email)
}