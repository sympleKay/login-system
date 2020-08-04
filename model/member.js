//Require Mongoose and Mongoose Schema
const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

//Create a new Schema for Model
const memberSchema = new Schema ({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

// Create Member Model based on Schema
let Member = mongoose.model('Member', memberSchema);

//Export the Member Model
module.exports = Member;