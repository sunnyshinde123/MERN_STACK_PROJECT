const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./model/listing.js");
const Review=require("./model/review.js");
const path=require("path");
const methodOverride = require('method-override');
const engineMate = require('ejs-mate');
const wrapAsync=require("./utility/wrapAsync.js");
const ExpressError=require("./utility/ExpressError.js");
const {listingSchemaJoi, reviewSchemaJoi}=require("./schema.js");
const listingRoute=require("./routes/listing.js");
const reviewRoute=require("./routes/review.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./model/user.js");
const userRoute=require("./routes/user.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.engine('ejs', engineMate);

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,"public/css")));
app.use(express.static(path.join(__dirname,"public/js")));
app.use(express.urlencoded({extended: true}));
app.use(express.json());


const sessionOptions={
    secret:"mynewsecret", 
    resave:false, 
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


main().then(()=>{
    console.log("DB is Connected");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}


app.listen(5050, ()=>{
    console.log("Successfully Connected to the port of 5050");
})

app.get("/demo", async(req, res)=>{
    let user1=new User({
        email:"Sunnyshinde157@gmail.com",
        username:"Sunny123"
    })

    let result=await User.register(user1, "apna123");
    res.send(result);
})

app.get("/",wrapAsync((req, res)=>{
    res.send("Welcome");
}))

app.use((req, res, next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
})

app.use("/listing", listingRoute);
app.use("/listing/:id/review", reviewRoute);
app.use("/", userRoute);


// app.get("/testListing", wrapAsync(async (req, res)=>{
//     let list1=new Listing({
//         title:"My Villa",
//         description:"Historical Palace",
//         price:1200,
//         location:"North-America",
//         Country:"America"
//     });
    
//     await list1.save();
//     res.send("Data Stored");
//     console.log("Sample Data Stored");
// }))



//Error Handling Middleware function


app.all("*",(req, res, next)=>{
    next(new ExpressError(404, "Page not found!!!"));
})

app.use((err, req, res, next) => {
    if (err.status === 404) {
      res.status(404).render("error.js",{err});
      res.set("Content-Type", "text/plain");
    //   res.send("Page not found.");
    }
  });
