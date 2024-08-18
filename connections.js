const mongoose  = require("mongoose")

async function connectMONGO(url) {
    return mongoose.connect(url)
}

module.exports = {connectMONGO}