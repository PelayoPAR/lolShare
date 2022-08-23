const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost/lolShare"; // or "mongodb://localhost:27017/lolShare" but port 27017 is assumed

module.exports = MONGO_URI;
