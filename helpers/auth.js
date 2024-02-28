//criando middleware de verificação de autenticação:

module.exports.checkAuth = function (req, res, next) {
    const userId = req.session.userid

    if(!userId) {
        req.flash('message', 'Usuário não autenticado, por favor, realize o login para continuar.')
        res.redirect('/login')
    }
    
    next()
}