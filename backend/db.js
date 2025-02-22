const mongoose = require('mongoose');


const mongoURI = "mongodb+srv://NonPanda:NonPanda@lol.feeeold.mongodb.net/meshcraft?retryWrites=true&w=majority";

const connectTOMongo = async () => {
    await mongoose.connect(mongoURI);
    console.log("Connected to Mongodb")

}

module.exports = connectTOMongo;