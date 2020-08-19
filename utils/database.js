const db = function() {
  const localDb = "mongodb://localhost:27017/bassline";
  const productionDb = "";
  return process.env.NODE_ENV === "production" ? productionDb : localDb;
};

module.exports = db;
