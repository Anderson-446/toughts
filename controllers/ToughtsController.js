const Tought = require('../models/Tought.js')
const User = require('../models/User.js')

const { Op } = require('sequelize')

module.exports = class ToughtsController {

    static async showToughts(req, res) {

        let search = ""
        //funcionalidade de busca. Para utilizar "like" na busca
        if(req.query.search) {
            search = req.query.search
        }

        let order = 'DESC'

        if(req.query.order ==='old') {
            order = 'ASC'
        } else {
            order = 'DESC'
        }

        try {
            
            const toughtsData = await Tought.findAll({
                include: User,
                where: {
                    //utilizando o operador like...
                    title: {[Op.like]: `%${search}%` },
                },
                order: [['createdAt', order]],
            })
            
            const toughts = toughtsData.map((result) => result.get({ plain: true }))

            let toughtsQty = toughts.length

            if(toughtsQty === 0) {
                toughtsQty = false
            }
    
            res.render('toughts/home', { toughts, search, toughtsQty })

        } catch (error) {

            console.log(error);
            
        }

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
            
            let emptyToughts = false

            if(toughts.length === 0) {
                emptyToughts = true
            }

            res.render('toughts/dashboard', {toughts, emptyToughts})

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

    static async updateTought(req, res) {

        try {
            
            const id = req.params.id

            const tought = await Tought.findOne({
                where: {
                    id: id
                },
                raw: true
            })
            console.log(tought);
    
            res.render('toughts/edit', { tought })

        } catch (error) {
            console.log(error);
        }

    }

    static async updateToughtSave(req, res) {

        const id = req.body.id

        const tought = {
            title: req.body.title
        }

        try {
            await Tought.update(tought, {
                where: {
                    id: id
                }
            })
    
            req.flash('message', "Pensamento atualizado com sucesso")
        
            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        } catch (error) {
            console.log(error);
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