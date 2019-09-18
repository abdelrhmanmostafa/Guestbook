const { MongoClient } = require('mongodb')

const Authenticate = () =>{
    MongoClient.connect('mongodb://localhost:27017/guest-book', (err, db) =>{
        if (err) {
            return console.log('Unable to connect to MongoDB server');
        }
        console.log("connected")

        db.close()
    })
}
const FindByToken = (token) =>{
    let decoded
    try {
        decoded = jwt.verify(token, process.env.JWT_SALT)
    } catch (error) {
        return Promise.reject()
    }
    return this.findOne({
        _id: decoded.id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })
}