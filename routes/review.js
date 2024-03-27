const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utility/wrapAsync.js");
const ExpressError=require("../utility/ExpressError.js");
const {reviewSchemaJoi}=require("../schema.js");
const Review=require("../model/review.js");
const Listing=require("../model/listing.js");





const validateReview=(req, res, next)=>{
    let {error}=reviewSchemaJoi.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=> el.message).join(",");
        throw new ExpressError(404, errMsg);
    }else{
        next();
    }
}

//review post route
router.post("/", validateReview, wrapAsync(async(req, res)=>{
    let data=new Review(req.body.review);
    let listing= await Listing.findById(req.params.id);
    
    listing.review.push(data);

    await data.save();
    await listing.save();
    req.flash("success", "new review created");
    res.redirect(`/listing/${listing._id}`);
}));

//review delete route

router.delete("/:reviewId", wrapAsync(async(req, res)=>{
    let {id, reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "review deleted");
    res.redirect(`/listing/${id}`);
}));

module.exports=router;