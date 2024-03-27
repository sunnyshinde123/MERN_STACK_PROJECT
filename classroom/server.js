const express=require("express");

const app=express();

const session=require("express-session");

const cookieParser=require("cookie-parser");
const flash=require("connect-flash");
const path=require("path");
const session=require("express-session");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));

app.use(cookieParser("secretcode"));
app.use(session({secret:"mysupersecret", resave:false, saveUninitialized:true}));
app.use(flash());

app.listen(9090, ()=>{
    console.log("Server listening");
})

app.get("/admin", (req, res)=>{
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count=1;
    }
    res.send(`Session ${req.session.count}`);
})

app.get("/register", (req, res)=>{
    let{name="Sunny"}=req.query;
    console.log(req.session);
    req.session.name=name;
    if(name==="Sunny"){
        req.flash("error", "user not registered");
    }else{
        req.flash("success", "user successfully registered");
    }
    res.redirect("/hello");
})

app.get("/hello", (req, res)=>{
    res.locals.msg=req.flash("success");
    res.locals.err=req.flash("error");
    res.render("hello.ejs", {name: req.session.name});
})
// app.get("/home", (req, res)=>{
//     res.cookie("greet", "namaste");
//     res.send("Welcome to Home Root");
// })

// app.get("/", (req, res)=>{
//     console.log(req.cookies);
//     res.send("Welcome");
// })

// app.get("/greet", (req, res)=>{
//     let {name="Ram"}=req.cookies;
//     res.send(`Hi ${name}`)
// })

// app.get("/getSignedCookies", (req, res)=>{
//     res.cookie("made_In", "India", {signed:true});
//     res.send("signedCookies");
// })

// app.get("/getCookies", (req, res)=>{
//     console.log(req.signedCookies);
//     res.send("Welcome to signed cookies");
// })