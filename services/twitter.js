const Twitter = require("../models/twitter");
const crypto = require('crypto')
const OAuth = require("oauth-1.0a")
const axios = require("axios")

exports.createTweet = async (tweet) => {
        const oauth = OAuth({
            consumer: {
                key: process.env.TWITTER_USER_ACCESS_TOKEN,
                secret: process.env.TWITTER_USER_SECRET,
            },
            signature_method: 'HMAC-SHA1',
            hash_function(base_string, key) {
                return crypto
                    .createHmac('sha1', key)
                    .update(base_string)
                    .digest('base64')
            },
        })

        const request = {
            method:"POST",
            body:{text: tweet},
            url: 'https://api.twitter.com/2/tweets'
        }
        
        const token = {
            key:process.env.ACCESS_TOKEN,
            secret:process.env.ACCESS_TOKEN_SECRET
        }
        
        const oauthAuthorize = oauth.authorize(request, token)
        
        const headers = oauth.toHeader(oauthAuthorize)
        
        await axios.post(request.url, request.body,{
    
            headers:headers
        })

    
}