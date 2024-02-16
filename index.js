const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore= require('session-file-store')(session)
const flash = require('express-flash')

const app = express()
const conn = require('./db/conn.js')

async function startServer() {
    try {
        await conn.sync();
        app.listen(3000)
    } catch (error) {
        console.log(error);
    }
}
startServer()