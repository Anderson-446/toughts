const Tought = require('../models/Tought.js')
const User = require('../models/User.js')

module.exports = class ToughtsController {
    static async showToughts(req, res) {
        res.render('toughts/home')
    }
    static async dashboard(req, res) {
        const userId = req.session.userid

        try {
            const user = await User.findOne({
                where: {
                    id: userId,
                },
                include: Tought,
                plain: true,
            })
    
            //check if user exists
            if(!user) {
                res.redirect('/login')
            }
    
            const toughts = user.Toughts.map((result) => result.dataValues)
            

            res.render('toughts/dashboard', {toughts})

        } catch (error) {
            console.log(error);
        }
    }
    static async createTought(req, res) {
        res.render('toughts/create')
    }
    static async createToughtSave(req, res) {
        const tought = {
            title: req.body.title,
            UserId: req.session.userid,
        }
        //É interessante fazer mais validações, como "se o usuário existe"

        try {
            await Tought.create(tought)

            req.flash('message', "Pensamento registrado com sucesso")
    
            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        } catch (error) {
            console.log(error)
        }
    }
    static async removeTought(req, res) {
        
        const id = req.body.id
        const UserId = req.session.userid
        try {
            await Tought.destroy({
                where: {
                    id: id,
                    UserId: UserId
                }
            })

            req.flash('message', "Pensamento excluído com sucesso")
    
            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        } catch (error) {
         console.log(error);   
        }
    }
}