const Listing = require("../models/listing");
const axios = require("axios");
async function getGeolocation(address) {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search`,
      {
        params: {
          q: address,
          format: "json",
        },
      }
    );

    if (!response.data || response.data.length === 0) {
      console.log("Error: No location found");
      return null;
    }

    const { lat, lon } = response.data[0];
    console.log(`Latitude: ${lat}, Longitude: ${lon}`);
    return { lat, lon };
  } catch (err) {
    console.error("Error fetching geolocation:", err);
    return null;
  }
}
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  // Ensure geolocation exists for all listings
  allListings = allListings.map((l) => {
    if (!l.geolocation) {
      l.geolocation = { lat: 0, lon: 0 };
    }
    return l;
  });

  res.render("listings/index", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Requested Listing Does Not Exists");
    return res.redirect("/listings");
  }

  if (!listing.geolocation) {
    listing.geolocation = { lat: 0, lon: 0 };
  }

  res.render("listings/show", { listing });
};

module.exports.createListing = async (req, res, next) => {
  let { title, description, image, price, location, country } =
    req.body.listing;

  const response = await getGeolocation(location + " " + country);
  let url = req.file.path;
  let filename = req.file.filename;

  const listing = {
    title: title,
    description: description,
    price: price,
    country: country,
    location: location,
    geolocation: response
      ? { lat: response.lat, lon: response.lon }
      : { lat: 0, lon: 0 },
  };
  const newListing = new Listing(listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Requested Listing Does Not Exists");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

  res.render("listings/edit", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  if (!req.body || !req.body.listing) {
    throw new ExpressError(400, "Send valid data for 'listing'");
  }
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};
