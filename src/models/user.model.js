const mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    user: String,
    password: String,
    level: Number
})
//                              Schema name   Schema obj  Collection name
module.exports = mongoose.model('User'      , userSchema, 'users'        )