const User = require('../models/User.js')

//criar e descriptografar a senha do usuário:
//a senha deve ir como um hash para o banco.
const bcrypt = require('bcryptjs')

module.exports = class AuthController {

    static async login(req, res) {
        res.render('auth/login')
    }
    
    static async loginPost(req, res) {
        const { email, password } = req.body

        //validations
        //find user
        const user = await User.findOne({ where: { email: email } })

        if(!user) {
           req.flash('message', 'Usuário não encontrado!') 
           res.render('auth/login')

           return;
        }
        //check if password match
        const passwordMatch = bcrypt.compareSync(password, user.password)

        if(!passwordMatch) {
            req.flash('message', 'O usuário existe, mas a senha está incorreta!')
            res.render('auth/login')
            
            return
        }
    
        //initialize session
        req.session.userid = user.id

        req.flash('message', 'Usuário autenticado!')
        
        req.session.save(() => {
            res.redirect('/')
        })
    }

    static async register(req,res) {
        res.render('auth/register')
    }

    static async registerPost(req, res) {
        const { name, email, password, confirmpassword } = req.body

        //password match validation
        if(password !== confirmpassword) {
            //mensagem pro front (flash message)
            req.flash('message', 'Senhas não coincidentes, tente novamente!')
            res.render('auth/register')

            return
        }
        //check if user exists
        const checkIfUserExists = await User.findOne({where: {email: email}})

        if(checkIfUserExists) {
            req.flash('message', 'Já há um cadastro com este e-mail!')
            res.render('auth/register')
            return
        }
        // create a password
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            name,
            email,
            password: hashedPassword
        }
        try {
            const createdUser = await User.create(user)
            //Initialize Session
            req.session.userid = createdUser.id

            req.flash('message', 'Novo cadastro realizado com sucesso!')
            //salvar sessão para garantir a sessão antes de redirecionar o usuário para /
            req.session.save(() => {
                res.redirect('/')
            })
        } catch (error) {
            console.log(error);
        }
    }

    static async logout(req, res) {
        req.session.destroy()
        res.redirect('/login')
    }
}