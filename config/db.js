const mongoose = require('mongoose');

const connectDb = async () => {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });
    console.log(`Mongo DB connected: ${connection.connection.host}, provider: ${process.env.GEOCODER_PROVIDER}`);
}

module.exports = connectDb;