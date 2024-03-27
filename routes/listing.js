const express=require("express");
const router=express.Router();
const wrapAsync=require("../utility/wrapAsync.js");
const ExpressError=require("../utility/ExpressError.js");
const {listingSchemaJoi}=require("../schema.js");
const Listing=require("../model/listing.js");


const validateListing=(req, res, next)=>{
    let {error}=listingSchemaJoi.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=> el.message).join(",");
        throw new ExpressError(404, errMsg);
    }else{
        next();
    }
}




//Index Route
router.get("/", wrapAsync(async (req, res)=>{
    let data= await Listing.find({});
    res.render("listing/index.ejs", {data});
}))

//New route
router.get("/new", wrapAsync((req, res)=>{
    res.render("listing/new.ejs");
}))


//Create Route
router.post("/",validateListing, wrapAsync(async (req, res) => {
    const data = new Listing(req.body.listing);
    await data.save();
    req.flash("success", "new listing added");
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
router.get("/:id", wrapAsync(async(req, res)=>{
    let{id}=req.params;
    let data=await Listing.findById(id).populate("review");
    if(!data){
        req.flash("error", "Listing you requested does not exists");
        res.redirect("/listing");
    }
    res.render("listing/show.ejs", {data});
}))

//Edit Route

router.get("/:id/edit",wrapAsync(async (req, res)=>{
    let{id}=req.params;
    let data=await Listing.findById(id);
    res.render("listing/edit.ejs",{data});
}))

router.put("/:id", wrapAsync(async(req, res)=>{
    let {id}=req.params;
    // let {title: newTitle, description: desc, img: imgUrl, price: priceAmt, location: locationPoint, country: countryPoint}=req.body;
    // await Listing.findByIdAndUpdate(id, {title:newTitle, description:desc, img:imgUrl, price:priceAmt, location:locationPoint, country:countryPoint});
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "listing updated");
    res.redirect("/listing");
}))

//Delete Route
router.delete("/:id", wrapAsync(async(req, res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "listing deleted");
    res.redirect("/listing");
}))

module.exports=router;