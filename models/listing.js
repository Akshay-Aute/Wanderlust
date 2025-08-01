const { ref, string, number } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
      url : String,
      filename:String,
  },
  price: {
    type: Number,
    default:5999
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews : [
    {
      type:Schema.Types.ObjectId,
      ref:"Review"
    }
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },
  geolocation:{
    lat : {
      type :Number,
    },
    lon : {
      type :Number,
    }
  },
  
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if (listing){
  await Review.deleteMany({_id :{$in: listing.reviews}});
  }
});
const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;