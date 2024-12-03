import "dotenv/config";

export default {
  expo: {
    name: "packsmart",
    slug: "packsmart",
    version: "1.0.0",
    extra: {
      googleApiKey: process.env.GOOGLE_MAPS_API_KEY,
    },
  },
};
