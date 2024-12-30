const { default: mongoose } = require("mongoose");


const contactSchema = new mongoose.Schema({

    contactName :String,
    contactNumber : Number,
    email : String


})


const ContactModel = mongoose.model("ContactModel",contactSchema)

module.exports={ContactModel}