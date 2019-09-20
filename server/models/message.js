var mongoose = require('mongoose')

var Message = mongoose.model('Message',{
    title:{
        type: String,
        trim: true
    },
    body:{
        type: String,
        trim: true,
        required: true
    },
    sendTo:{
        type: String,
        required: true
    },
    sentAt:{
        type: String
    },
    reply:{
        type: String
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

module.exports = {Message}