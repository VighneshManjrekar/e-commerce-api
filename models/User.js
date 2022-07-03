const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
    select: false,
  },
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
  profile: {
    type: String,
    default: "profile.jpg",
  },
  resetPasswordToken: String,
  resetPasswordDate: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

UserSchema.pre("findOneAndUpdate", async function (next) {
  if (this._update.password) {
    this._update.password = await bcrypt.hash(this._update.password, 10);
  }
  next();
});

UserSchema.pre("remove", async function (next) {
  await this.model("Review").deleteMany({ product: this._id });
  next();
});

UserSchema.methods.matchPassword = async function (passwordEntered) {
  return await bcrypt.compare(passwordEntered, this.password);
};

UserSchema.methods.signToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

UserSchema.methods.addToCart = async function (product) {
  const productIndex = this.cart.items.findIndex(
    (prod) => prod.productId.toString() == product._id.toString()
  );
  let qty = 1;
  const cartItems = [...this.cart.items];
  if (productIndex >= 0) {
    qty = this.cart.items[productIndex].quantity + 1;
    cartItems[productIndex].quantity = qty;
  } else {
    cartItems.push({ productId: product._id, quantity: qty });
  }
  this.cart.items = cartItems;
  return this.save();
};

UserSchema.methods.removeCartItem = async function (prodId) {
  const updatedCart = this.cart.items.filter(
    (product) => product.productId.toString() != prodId
  );
  this.cart.items = updatedCart;
  await this.save();
};

UserSchema.methods.createHashToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordDate = Date.now() + 10 * 60 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
