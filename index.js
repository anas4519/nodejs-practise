const express = require("express")
const urlRoute = require('./routes/url')
const { connectMONGO } = require('./connections')
const URL = require('./models/url')
const {checkForAuthentication, restrictTo} = require("./middlewares/auth")
const { timeStamp } = require("console")
const userRoute = require("./routes/user")

const app = express()
const PORT = 8001
connectMONGO('mongodb://127.0.0.1:27017/short-url').then(console.log('MongoDB connected'))
app.use(express.json())
app.get("/test", async(req, res)=>{
    const allUrls = await URL.find({});
    res.end(JSON.stringify(allUrls))
})
app.use('/url', restrictTo(["NORMAL"]),urlRoute)
app.use('/user', userRoute)
app.use(checkForAuthentication());
app.get('/:shortID', async (req, res) => {
    const shortID = req.params.shortID;
    const entry = await URL.findOneAndUpdate({
        shortID,
    }, {
        $push: {
            visitHistory: {
                timeStamp: Date.now()
            }
        }
    });
    res.redirect(entry.redirectURL)
})

app.listen(PORT, () => console.log(`Server started at Port : ${PORT}`)
)