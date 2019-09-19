require('./config/config')

var {Message} = require('./models/message')
var {User} = require('./models/user')

const express = require('express')
const bodyparser = require('body-parser')
const cors = require('cors')
const fs = require('fs')
const {ObjectID} = require('mongodb')
const _ = require('lodash')

var app = express()

app.use(cors())
app.use(bodyparser.json())
app.use((req, res, next) =>{
    var now = new Date().toString()
    fs.appendFile('./backEnd/server/server.log', `${now}: ${req.method}, ${req.url} \n`, (err) =>{
        if(err)
            console.log('logging error')
    })
    next()
})

let Authenticate = (req, res, next) =>{
    User.findByToken(req.header('x-auth')).then((user) =>{
        if(!user)
            return Promise.reject()
        req.user = user
        req.token = req.header('x-auth')
        next()
    }).catch((e) =>{
        res.status(401).send()
    })
}

app.post('/messages', Authenticate, (req, res) =>{
    var message = new Message({
        title: req.body.title,
        body: req.body.body,
        sendTo: req.body.sendto,
        sentAt: req.body.sentat,
        user: req.user._id
    })
    message.save().then((doc) =>{
        res.send(doc)
    }, (e)=>{
        res.status(400).send(e)
    })
})

app.get('/messages', Authenticate, (req, res) =>{
    Message.find({user: req.user._id}).then((data) => {
        res.send(data)
    }).catch((e)=>{
        res.status(400).send(e)
    })
})

app.get('/messages/:id', Authenticate, (req, res) =>{
    let id = req.params.id
    if(!ObjectID.isValid(id))
        res.status(404).send()
    else{
        Message.findOne({_id: id, user: req.user._id}).then((message) =>{
            if(message)
                res.send(message)
            else
                res.status(404).send()
        },(e) =>{
            res.status(400).send()
        })
    }
})

app.delete('/messages/:id', Authenticate, (req, res) =>{
    let id = req.params.id
    if(!ObjectID.isValid(id))
        return res.status(404).send()
    Message.findOneAndDelete({_id: id, user: req.user._id}).then((message) =>{
        if(!message)
            return res.status(404).send()
        res.send(message)
    }, (e) =>{
        res.status(404).send()
    })
})

app.patch('/messages/:id', Authenticate, (req, res) =>{
    let id = req.params.id
    let body = _.pick(req.body, ['title', 'body', 'sendto', 'sentat'])
    if(!ObjectID.isValid(id))
        return res.status(404).send()
    Message.findOneAndUpdate({_id: id, user: req.user._id}, {$set: body}, {new: true}).then((message) =>{
        if(!message)
            return res.status(404).send()
        res.send(message)
    }).catch((e) =>{
        res.status(400).send()
    })
})

//User Routes

app.post('/users',(req, res) =>{
    let user = new User(_.pick(req.body, ['email', 'password', 'name']))
    user.generateAuthtoken().then((token) =>{
        res.header('x-auth', token).send(user)
    }).catch((e)=>{
        res.status(400).send(e)
    })
})

app.get('/users/me', Authenticate, (req, res) =>{
    res.send(req.user)
})

app.post('/users/login', (req, res) =>{
    let body = _.pick(req.body, ['email', 'password'])
    User.findByCredentials(body.email, body.password).then((user) =>{
        return user.generateAuthtoken().then((token) =>{
            res.header('x-auth', token).send(user)
        })
    }).catch((e) =>{
        res.status(400).send()
    })
})

app.delete('/users/logout', Authenticate, (req, res) =>{
    req.user.deleteToken(req.token).then(() =>{
        res.send()
    }).catch((e) => res.status(400).send())
})

app.post('/users/validate', (req, res) =>{
    User.findByEmail(req.body.email).then(() => res.send() ).catch(()=> res.status(400).send())
})

app.listen(process.env.PORT, ()=>{
    console.log(`server start on port ${process.env.PORT}`)
})

module.exports = {app}