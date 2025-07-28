const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}

let initDB = async () => {
  await Listing.deleteMany({});

  updatedData = initData.data.map((obj) => ({
    ...obj,
    owner: "687cb43967592fcc1291ff7b",
  }));
  await Listing.insertMany(updatedData);
  console.log("data Was Initialized");
};

initDB();
