const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore= require('session-file-store')(session)
const flash = require('express-flash')

const app = express()
const conn = require('./db/conn.js')


// Models
const Tought = require("./models/Tought.js")
const User = require("./models/User.js")

//import routes
const toughtsRoutes = require("./routes/toughtsRoutes.js")

//import controller
const ToughtsController = require('./controllers/ToughtsController.js')
//template engine
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

//public path
app.use(express.static('public'))

//receber respostas do body
app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

//session middleware
app.use(
    session({
        name: "session",
        secret: 'nosso_secret',
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function() {},
            path: require('path').join(require('os').tmpdir(), 'sessions'),
        }),
        cookie: {
            secure: false,
            maxAge:360000,
            expres: new Date(Date.now() + 360000),
            httpOnly: true
        }
    }),
)

// flash messages
app.use(flash())

//set sesstion to res
app.use((req, res, next) => {
    if(req.session.userid) {
        res.locals.session = req.session
    }
    next()
})
//Routes
app.use('/toughts', toughtsRoutes)

app.get('/', ToughtsController.showToughts)


async function startServer() {
    try {
        await conn.sync();
        app.listen(3000)
    } catch (error) {
        console.log(error);
    }
}
startServer()