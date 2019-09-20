const expect = require('expect')
const request = require('supertest')
const {app} = require('../server')
const {Message} = require('../models/message')
const {User} = require('../models/user')
const {ObjectID} = require('mongodb')
const {messages, fillMessages, fillUsers, users} = require('./seed')

beforeEach(fillUsers)
beforeEach(fillMessages)

describe('Test Post messages', function () {
    this.timeout(10000)
    it('Should Add new Message', (done) =>{
        var text = "post test run"
        request(app).post('/messages').send({text}).set('x_auth', users[0].tokens[0].token)
        .expect(200).expect((res) =>{
            expect(res.body.text).toBe(text)
        })
        .end((err,res) =>{
            if(err)
                return done(err)
            Message.find({text}).then((messages) =>{
                expect(messages.length).toBe(1)
                expect(messages[0].text).toBe(text)
                done()
            }).catch((E) => done(E))
        })
    })
    it('Shouldn\'t Add a Message',(done) =>{
        request(app).post('/messages').send().set('x_auth', users[0].tokens[0].token)
        .expect(400)
        .end((err,res) =>{
            if(err)
                return done(err)
            Message.find().then((messages) =>{
                expect(messages.length).toBe(2)
                done()
            }).catch((E) => done(E))
        })
    })
})

describe('Testing Get all Messages',function (){
    this.timeout(10000)
    it('Should get all messages',(done) =>{
        request(app).get('/messages').set('x_auth', users[0].tokens[0].token)
        .expect(200).expect((res) =>{
            expect(res.body.length).toBe(1)
        })
        .end(done)
    })
})

describe('Testing Get Messages by ID',function (){
    this.timeout(10000)
    it('Should Get the correct Message', (done)=>{
        request(app).get(`/messages/${messages[0]._id}`).set('x_auth', users[0].tokens[0].token)
        .expect(200).expect((res) =>{
            expect(res.body.title).toBe(messages[0].title)
        }).end(done)
    })

    it('Should not get message created by other user', (done)=>{
        request(app).get(`/messages/${messages[1]._id}`).set('x_auth', users[0].tokens[0].token)
        .expect(404).end(done)
    })

    it('Should not return a Doc [ID not found]', (done) =>{
        let id = new ObjectID()
        request(app).get(`/messages/${id}`).set('x_auth', users[0].tokens[0].token)
        .expect(404).end(done)
    })

    it('Should not return a Doc [ID is invalide]', (done) =>{
        request(app).get('/messages/123456').set('x_auth', users[0].tokens[0].token)
        .expect(404).end(done)
    })
})

describe('Testing Delete Messages', function (){
    this.timeout(10000)
    it('Should Delete Message',(done) =>{
        request(app).delete(`/messages/${messages[0]._id}`).set('x_auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) =>{
            expect(res.body._id).toBe(messages[0]._id.toHexString())
        })
        .expect(()=>{
            Message.findById(messages[0]._id).then((messages)=>{
                expect(Message).toBeFalsy()
            },(e)=> done())
        }).end(done)
    })

    it('Should Not Delete Message If not the own user',(done) =>{
        request(app).delete(`/messages/${messages[1]._id}`).set('x_auth', users[0].tokens[0].token)
        .expect(404)
        .expect(()=>{
            Message.find().then((messages)=>{
                expect(messages.length).toBe(2)
            },(e)=> done())
        }).end(done)
    })

    it('Should not Delete Message [ID not found]',(done) =>{
        let id = new ObjectID()
        request(app).delete(`/messages/${id}`).set('x_auth', users[0].tokens[0].token)
        .expect(404)
        .expect(()=>{
            Message.find().then((messages)=>{
                expect(messages.length).toBe(2)
            },(e)=> done())
        }).end(done)
    })
    it('Should not Delete Message [ID is invalide]',(done) =>{
        let id = messages[0]._id + '11'
        request(app).delete(`/messages/${id}`).set('x_auth', users[0].tokens[0].token)
        .expect(404)
        .expect(()=>{
            Message.find().then((messages)=>{
                expect(messages.length).toBe(2)
            },(e)=> done())
        }).end(done)
    })
})

describe('Testing Update Messages', function(){
    this.timeout(10000)
    it('Should Update Message',(done)=>{
        request(app).patch(`/messages/${messages[0]._id}`).send({ reply: "this is a reply" }).set('x_auth', users[0].tokens[0].token)
        .expect(200).expect((res) =>{
            expect(res.body.reply).toBe("this is a reply")
        })
        .end(done)
    })

    it('Should Not Update Message If Not The Own User',(done)=>{
        request(app).patch(`/messages/${messages[1]._id}`).send({ reply: "this is a reply" }).set('x_auth', users[0].tokens[0].token)
        .expect(404).end(done)
    })
})

describe('Test get indevidual user', function(){
    this.timeout(10000)
    it('should return user if authenticated', (done) =>{
        request(app).get('/users/me').set('x_auth', users[0].tokens[0].token)
        .expect(200).expect((res)=>{
            expect(res.body.user._id).toBe(users[0]._id.toHexString())
            expect(res.body.user.email).toBe(users[0].email)
        }).end(done)
    })
    it('should return 401 if not authenticated', (done) =>{
        request(app).get('/users/me')
        .expect(401).expect((res) =>{
            expect(res.body).toEqual({})
        }).end(done)
    })
})

describe('Test Post Users', function(){
    this.timeout(10000)
    it('Should Creat a User', (done) =>{
        request(app).post('/users').send({ name:"abdelrhman", email: 'user1@example.com', password: '12345678' })
        .expect(200).expect((res) =>{
            expect(res.body.user.email).toBe('bo5a@example.com')
            expect(res.body.token).toBeDefined()
            expect(res.body.user._id).toBeDefined()
            User.find().then((data) =>{
                expect(data.length).toBe(3)
            })
        }).end(done)
    })
    it('Should Return Validation Error if Request Invalide', (done) =>{
        request(app).post('/users').send({ name:"abdelrhman", email: 'user1@examp', password: '1234568'})
        .expect(400).end(done)
    })
    it('should not creat user if email is used', (done) =>{
        request(app).post('/users').send({ name:users[0].name, email: users[0].email, password: users[0].password})
        .expect(400).end(done)
    })
})

describe('Test User Login', function(){
    this.timeout(10000)
    it('should login user and return auth token', (done) =>{
        request(app).post('/users/login').send({email: users[1].email, password: users[1].password})
        .expect(200).expect((res) =>{
            expect(res.body.token).toBeDefined()
        }).end((err, res) =>{
            if(err)
                return done(err)
            User.findById(users[1]._id).then((user) =>{
                expect(user.tokens.length).toBe(2)
                expect(user.tokens[1].token).toBe(res.body.token)
                done()
            }).catch((e) => done(e))
        })
    })
    it('should not return x_auth header and reject login',(done) =>{
        request(app).post('/users/login').send({email: users[1].email, password: '12345678'})
        .expect(400).expect((res) =>{
            expect(res.body.token).toBeUndefined()
        }).end(done)
    })
})

describe('Test Delete Token [logout user]', function(){
    this.timeout(10000)
    it('should delete the token', (done) =>{
        request(app).delete('/users/me/token').set('x_auth', users[0].tokens[0].token)
        .expect(200).end((err, res) =>{
            if(err)
                return done(err)
            User.findById(users[0]._id).then((user) =>{
                expect(user.tokens.length).toBe(0)
                done()
            }).catch((e) => done(e))
        })
    })
})