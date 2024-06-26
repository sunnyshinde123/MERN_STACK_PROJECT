const express=require("express");
const router=express.Router();
const User=require("../model/user.js");
const passport = require("passport");
const {isLoggedIn}=require("../middleware.js");
const {redirectUrl}=require("../middleware.js");


//signUp page login
router.get("/signup", (req, res)=>{
    res.render("user/signup.ejs");
})


//signed IN page 
router.post("/signup",async(req, res)=>{
    try{
        let{username, email, password}=req.body;
        let user1=new User({
            username,
            email,
        })
        let result= await User.register(user1, password);
        console.log(result);
        req.login(user1, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to the wanderlust")
            res.redirect("/listing");
        })
    }catch(err){
        req.flash("error", `${err.message}, please go with login`);
        res.redirect("/login");
    }
})

//login page get route
router.get("/login", (req, res)=>{
    res.render("user/login.ejs");
})

//post route logged in
router.post("/login", redirectUrl, passport.authenticate("local",{failureRedirect:"/login", failureFlash:true}), async(req, res)=>{
    req.flash("success", "welcome to wanderlust");
    let redirecturl=res.locals.redirectUrl ? res.locals.redirectUrl : "/listing";
    res.redirect(redirecturl);
});


//logout page get route
router.get("/logout", (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listing");
    })
})

module.exports=router;