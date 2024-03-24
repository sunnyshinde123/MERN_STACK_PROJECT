const express=require("express");
const mongoose=require("mongoose");
const app=express();
const path=require("path");
const engine = require('ejs-mate');
app.engine('ejs', engine);

const wrapAsync=require("./utility/wrapAsync.js");
const ExpressError=require("./utility/ExpressError.js");

const methodOverride = require('method-override');
const Listing=require("./model/listing.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,"public/css")));
app.use(express.static(path.join(__dirname,"public/js")));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

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

app.get("/",wrapAsync((req, res)=>{
    res.send("Welcome");
}))

app.get("/testListing", wrapAsync(async (req, res)=>{
    let list1=new Listing({
        title:"My Villa",
        description:"Historical Palace",
        price:1200,
        location:"North-America",
        Country:"America"
    });
    
    await list1.save();
    res.send("Data Stored");
    console.log("Sample Data Stored");
}))


//Index Route
app.get("/listing", wrapAsync(async (req, res)=>{
    let data= await Listing.find({});
    res.render("listing/index.ejs", {data});
}))

//New route
app.get("/listing/new", wrapAsync((req, res)=>{
    res.render("listing/new.ejs");
}))

//Show Route
app.get("/listing/:id", wrapAsync(async(req, res)=>{
    let{id}=req.params;
    let data=await Listing.findById(id);
    res.render("listing/show.ejs", {data});
}))

//Create Route
app.post("/listing", wrapAsync(async (req, res)=>{
    // let result=listingSchema.validate(req.body);
    // if(result.error){
    //     throw new ExpressError(404, result.error);
    // }
    const data=new Listing(req.body.listing);
    console.log(data.img);
    await data.save();
    res.redirect("/listing");

}))

//Edit Route

app.get("/listing/:id/edit",wrapAsync(async (req, res)=>{
    let{id}=req.params;
    let data=await Listing.findById(id);
    res.render("listing/edit.ejs",{data});
}))

app.put("/listing/:id", wrapAsync(async(req, res)=>{
    let {id}=req.params;
    // let {title: newTitle, description: desc, img: imgUrl, price: priceAmt, location: locationPoint, country: countryPoint}=req.body;
    // await Listing.findByIdAndUpdate(id, {title:newTitle, description:desc, img:imgUrl, price:priceAmt, location:locationPoint, country:countryPoint});
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listing`);
}))

//Delete Route
app.delete("/listing/:id", wrapAsync(async(req, res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Bad Request");
    }
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
}))

//Error Handling Middleware function


app.all("*",(req, res, next)=>{
    next(new ExpressError(404, "Page not found!!!"));
})

app.use((err, req, res, next)=>{
    let {status=500, message="Page not found"}=err;
    res.render("error.ejs", {err});
})
