var mongoose = require("mongoose");

var contactSchema = new mongoose.Schema({
    name: String,
    address: String,
    phone: String,
    email: String,
    cbPhone: Boolean,
    cbEmail: Boolean,
    cbMail: Boolean,
    any: Boolean,
    lat: String,
    lng: String
});

module.exports = mongoose.model("Contact", contactSchema);