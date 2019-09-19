var mongoose = require('mongoose')

var Message = mongoose.model('Message',{
    title:{
        type: String,
        trim: true
    },
    body:{
        type: String,
        trim: true
    },
    sendTo:{
        type: String,
        required: true
    },
    sentAt:{
        type: Number,
        default: null
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

module.exports = {Message}