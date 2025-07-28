const axios = require("axios");
async function getGeolocation(address) {
  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
      params: {
        q: address,
        format: "json",
      },
    });

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
module.exports = getGeolocation;
