const DataStore = require('nedb')
const db = new DataStore('dataBase.db')
module.exports = db
