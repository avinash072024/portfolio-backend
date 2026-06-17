const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    fileName: {
        type: String,
        required: true,
    },
    contentType: {
        type: String,
        default: 'application/pdf',
    },
    pdfData: {
        type: String, // Store the Base64 encoded string here
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);