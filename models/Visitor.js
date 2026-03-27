const mongoose = require('mongoose');

const visitorSchema = mongoose.Schema(
  {
    status: {
      type: String,
      default: 'success',
    },
    country: {
      type: String,
    },
    countryCode: {
      type: String,
    },
    region: {
      type: String,
    },
    regionName: {
      type: String,
    },
    city: {
      type: String,
    },
    zip: {
      type: String,
    },
    lat: {
      type: Number,
    },
    lon: {
      type: Number,
    },
    timezone: {
      type: String,
    },
    isp: {
      type: String,
    },
    org: {
      type: String,
    },
    as: {
      type: String,
    },
    query: {
      type: String, // This is the IP address
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Visitor', visitorSchema);
