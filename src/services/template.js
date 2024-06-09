const ejs = require('ejs');
const fs = require('fs');
const path = require('path')
require('dotenv').config()

exports.verifyTemplate = (user, token) => {
    const template = fs.readFileSync(path.resolve(__dirname, '../emailTemplates/verify.ejs'), 'utf-8');
    const url = process.env.BASE_URL + '/users/verify/' + token;
    const data = {
      name: user.firstName,
      message: "Please verify your email.", 
      url: url
    }
    
    return {
        from: process.env.EMAIL_ID,
        to: user.email,
        subject: "Verify your account!",
        html: ejs.render(template, data)
      };
}

