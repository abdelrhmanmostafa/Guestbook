let enve = process.env.NODE_ENV || "dev"


if(enve === 'test' || enve === 'dev'){
    let config = require('./config.json')
    process.env = {  ...config[enve]  }
}