const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utility/wrapAsync.js");
const ExpressError=require("../utility/ExpressError.js");
const {reviewSchemaJoi}=require("../schema.js");
const Review=require("../model/review.js");
const Listing=require("../model/listing.js");
const { isLoggedIn, validateReview }=require("../middleware.js");






//review post route
router.post("/", isLoggedIn, validateReview, wrapAsync(async(req, res)=>{
    let data=new Review(req.body.review);
    let listing= await Listing.findById(req.params.id);
    
    listing.review.push(data);

    await data.save();
    await listing.save();
    req.flash("success", "new review created");
    res.redirect(`/listing/${listing._id}`);
}));

//review delete route

router.delete("/:reviewId", isLoggedIn, wrapAsync(async(req, res)=>{
    let {id, reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "review deleted");
    res.redirect(`/listing/${id}`);
}));

module.exports=router;