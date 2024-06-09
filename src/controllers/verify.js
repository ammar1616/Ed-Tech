const mailServices = require('./../services/mail');
const templateService = require('../services/template');
const userService = require('./../services/user');

const crypto = require('crypto');

exports.sendVerificationMail = async (req, res) => {
    try {
    const token = crypto.randomBytes(32).toString("hex");
    //Missing step : store in database (will do after update is added to userservice)
    const mailTemplate = templateService.verifyTemplate(req.user, token);

    const emailSent = await mailServices.sendMail(mailTemplate);

    res.status(200).json({message: "Verification Email Sent!", emailSent})
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Internal Server Error"})
    }
}

exports.verifyUser = (req, res) => {

}