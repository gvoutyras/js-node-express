var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var paymentData = new Schema({
  uniqueId: {
    type: String,
    required: true,
  },
  clientName: {
    type: String,
    required: true,
  },
  clientUrl: {
    type: String,
    required: true,
  },
  apiKey: {
    type: String,
    required: true,
  },
  everypay: {
    privateKey: {
      type: String,
      required: true,
    },
  },
});

module.exports = mongoose.model("PaymentData", paymentData);
