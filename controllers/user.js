const User = require('../models/user')
const {v4: uuidv4} = require('uuid')
const {setUser} = require('../service/auth')

async function handleUserSignup(req, res) {
    const {name, email, password} = req.body;
    await User.create({
        name,
        email,
        password,
    });
    return res.json({ status: "User Created Successfully" });
}
async function handleUserLogin(req, res) {
    const {email, password} = req.body;
    const user = await User.findOne({
        email,
        password,
    });
    if(!user) return res.status(404).json({status : 'user not found'})
    const sessionId = uuidv4();
    setUser(sessionId, user);
    res.cookie("uid", sessionId);
    return res.json({ status: "Logged in Successfully" });
}

module.exports = {
    handleUserSignup,
    handleUserLogin
}