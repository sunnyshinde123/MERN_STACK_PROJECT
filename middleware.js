const Listing=require("./model/listing.js");
const ExpressError=require("./utility/ExpressError.js");
const {listingSchemaJoi, reviewSchemaJoi}=require("./schema.js");

module.exports.isLoggedIn=(req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error", "you must be logged into listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.redirectUrl=(req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async (req, res, next)=>{
    let {id}=req.params;
    let listingId=await Listing.findById(id);
    if(!listingId.owner.equals(res.locals.currSessionUser._id)){
    req.flash("error", "you are not the owner of this listing");
    return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.validateListing=(req, res, next)=>{
    let {error}=listingSchemaJoi.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=> el.message).join(",");
        throw new ExpressError(404, errMsg);
    }else{
        next();
    }
}

module.exports.validateReview=(req, res, next)=>{
    let {error}=reviewSchemaJoi.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=> el.message).join(",");
        throw new ExpressError(404, errMsg);
    }else{
        next();
    }
}


