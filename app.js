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


app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.engine('ejs', engineMate);

app.use(methodOverride('_method'));
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

const validateListing=(req, res, next)=>{
    let {error}=listingSchemaJoi.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=> el.message).join(",");
        throw new ExpressError(404, errMsg);
    }else{
        next();
    }
}

const validateReview=(req, res, next)=>{
    let {error}=reviewSchemaJoi.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=> el.message).join(",");
        throw new ExpressError(404, errMsg);
    }else{
        next();
    }
}

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


//Create Route
app.post("/listing",validateListing, wrapAsync(async (req, res) => {
    const data = new Listing(req.body.listing);
    await data.save();
    res.redirect("/listing");
}))

// app.post("/listing", wrapAsync(async (req, res) => {
//     const data = new Listing(req.body.listing);
//     let image = data.img;
//     data.img = image;
//     console.log(data);
//     await data.save();
//     return res.status(200).redirect("/listing");
// }));

//Show Route
app.get("/listing/:id", wrapAsync(async(req, res)=>{
    let{id}=req.params;
    let data=await Listing.findById(id).populate("review");
    res.render("listing/show.ejs", {data});
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
    res.redirect("/listing");
}))

//Delete Route
app.delete("/listing/:id", wrapAsync(async(req, res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
}))

//review post route
app.post("/listing/:id/review", validateReview, wrapAsync(async(req, res)=>{
    let data=new Review(req.body.review);
    let listing= await Listing.findById(req.params.id);
    
    listing.review.push(data);

    await data.save();
    await listing.save();
    res.redirect(`/listing/${listing._id}`);
}));

//review delete route

app.delete("/listing/:id/review/:reviewId", wrapAsync(async(req, res)=>{
    let {id, reviewId}=req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listing/${id}`);
}));

//Error Handling Middleware function


// app.all("*",(req, res, next)=>{
//     next(new ExpressError(404, "Page not found!!!"));
// })

app.use((err, req, res, next) => {
    console.log(err.name);
    let { status = 500, message = "Page not found" } = err;
    res.status(status).render("error.ejs", { err });
});
