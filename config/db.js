const mongoose = require("mongoose");

const connectDB = async () => {
  const mongodb = await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(`MongoDB connected: ${mongodb.connection.host}`);
};

module.exports = connectDB;
