const protect = (req, res, next) => {
    if (req.session.loggedIn) {
        next()
    }
    else if (req.body?.axios) {
        next()
    }
    else {
        res.redirect('/login')
    }

}
module.exports = protect
