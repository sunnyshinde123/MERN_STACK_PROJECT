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

const initDB = async () => {
    await Listing.deleteMany({});
  
    // Corrected mapping to add 'owner' field
    initData.data = initData.data.map((obj) => ({
      ...obj,
      owner: "6605423956b61ab48f072baf", // Assuming this is a valid owner ID
    }));
  
    try {
      await Listing.insertMany(initData.data);
      console.log("Data Was Initialized");
    } catch (error) {
      console.error("Error initializing data:", error.message);
    }
  };

initDB();