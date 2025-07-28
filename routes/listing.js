const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require('../models/listing.js');
const { isLoggedIn, isOwner,validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const { storage } = require("../cloudConfig.js");
const { default: axios } = require("axios");
const upload = multer({ storage });


router
.route("/")
//index route
.get(wrapAsync(listingController.index))
//create route
.post(isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing)
);

// new Listing
router.get("/new",
    isLoggedIn,
    listingController.renderNewForm);

router
.route("/:id")
//Show Route
.get(wrapAsync(listingController.showListing))
//Update Route
.put(isLoggedIn,
    isOwner, 
    upload.single('listing[image]'), 
    validateListing,
    wrapAsync(listingController.updateListing))
//Delete Route 
.delete(isLoggedIn,
    isOwner, 
    wrapAsync(listingController.deleteListing));

//edit route 
router.get("/:id/edit",
    isLoggedIn,
    isOwner, 
    wrapAsync(listingController.renderEditForm));



module.exports= router;