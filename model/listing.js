const mongoose=require("mongoose");


const listingSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    img:{
        type:String,
        default:
            "https://unsplash.com/photos/a-group-of-people-swimming-in-the-ocean-eWVBPrp_L1c",
        set:(v)=>
            v===""?"https://unsplash.com/photos/a-group-of-people-swimming-in-the-ocean-eWVBPrp_L1c":v,
    },
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    }
})

const Listing=mongoose.model("Listing", listingSchema);

module.exports=Listing;