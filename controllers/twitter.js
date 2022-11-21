const { createTweet } = require("../services/twitter");


const newTweet = async(req, res) =>{
    try {
        const text = req.body.text;
        await createTweet(text);
        res.status(200).send("OK");
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
}

module.exports = {newTweet};
