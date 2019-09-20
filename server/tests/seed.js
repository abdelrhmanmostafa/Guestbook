const {Message} = require('../models/todo')
const {ObjectID} = require('mongodb')
const {User} = require('../models/user')
const jwt = require('jsonwebtoken')


let user1id = new ObjectID()
let user2id = new ObjectID()
const users = [{_id: user1id, name: 'user1', email: 'user1@example.com', password: '1234user', 
                tokens: [{access: 'auth', token: jwt.sign({id: user1id, access: 'auth'}, process.env.JWT_SALT).toString()}]},
            {_id: user2id, name:'user2', email: 'user2@example.com', password: '1234user',
            tokens: [{access: 'auth', token: jwt.sign({id: user2id, access: 'auth'}, process.env.JWT_SALT).toString()}]}]

const messages = [{_id: new ObjectID(), title: "el awal", body: "some message1",sendTo: "asd@asd.com", reply: "", user: user1id},
                {_id: new ObjectID(), title: "el tany", body: "some message2",sendTo: "asd@asd.com", reply: "i saw the message", user: user2id}]

let fillMessages = function (done) {
    this.timeout(10000)
    Message.deleteMany({}).then(() =>{
        return Message.insertMany(messages)
    }).then(() => done())
}

let fillUsers = function(done){
    this.timeout(10000)
    User.deleteMany({}).then(() =>{
        let user1 = new User(users[0]).save()
        let user2 = new User(users[1]).save()
        return Promise.all([user1, user2])
    }).then(() => done())
}

module.exports = {messages, fillMessages, fillUsers, users}