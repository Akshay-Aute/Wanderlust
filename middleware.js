const Listing = require("./models/listing.js")
const ExpressError = require("./utils/ExpressError.js");
const Review = require('./models/review.js')
const { listingSchema ,reviewSchema,isReviewAuthor} = require("./schema.js"); 

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl;
    req.flash("error","You must be logged In.");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req,res,next) => {
 let { id } = req.params;
 let listing = await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","Your Are Not The Owner Of This Listing");
  return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = (req,res,next)=>{
  let { error } = listingSchema.validate(req.body); 
    if(error){
      let errMsg = error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
    } else{
      next();
    }
};

module.exports.validateReview = (req,res,next)=>{
  let { error } = reviewSchema.validate(req.body); 
    if(error){
      let errMsg = error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
    } else{
      next();
    }
};

module.exports.isReviewAuthor = async (req,res,next) => {
 let { reviewId,id} = req.params;
 let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","Your Are Not The Author Of This review");
  return res.redirect(`/listings/${id}`);
  }
  next();
};