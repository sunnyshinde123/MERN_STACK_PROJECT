const mongoose=require("mongoose");

const Listing=require("../model/listing.js");

const initData=require("./init.js");

main()
.then(()=>{
    console.log("DB Connected");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB= async () =>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data Was Initialized");
}

initDB();