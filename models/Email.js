// models/Email.js
const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
});

const Email = mongoose.model('Email', emailSchema);

module.exports = Email;
