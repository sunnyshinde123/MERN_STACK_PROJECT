module.exports.isLoggedIn=(req, res, next)=>{
    if(!req.isAuthenticated()){
        req.flash("error", "you must be logged into listing");
        return res.redirect("/login");
    }
    next();
}