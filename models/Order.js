const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    require: true,
  },
  items: [
    {
      product: {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          require: true,
        },
        price: Number,
      },
      quantity: Number,
    },
  ],
  total: Number,
  orderedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
