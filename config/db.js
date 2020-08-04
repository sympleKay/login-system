// Require Mongoose Dependecies
const mongoose = require ('mongoose');

// Create MongoDB connection function
const MongoDB = function () {
    mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
    let db = mongoose.connection;
    db.on('error', (err) => {
        console.log(err);
    })
    db.once('open', ()=> {
        console.log(`MongoDB connected sucessfully`);
    })
}

module.exports = MongoDB;