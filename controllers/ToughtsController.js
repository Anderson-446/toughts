const Tought = require('../models/Tought.js')
const User = require('../models/User.js')

module.exports = class ToughtsController {
    static async showToughts(req, res) {
        res.render('toughts/home')
    }
}