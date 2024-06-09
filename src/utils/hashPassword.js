const bcrypt = require('bcrypt')
require('dotenv').config();

const hashPassword = async (user) => {
    try {
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
        if(user.password){
            console.log("HELLO")
            const hashedPassword = await bcrypt.hash(user.password, salt);
            user.password = hashedPassword;
            console.log(user.password, hashedPassword)
        } else if(user.attributes.password){
            const hashedPassword = await bcrypt.hash(user.attributes.password, salt);
            user.attributes.password = hashedPassword;
        }
        return user.password;
    } catch (error) {
        throw error;
    }
}

module.exports = hashPassword;