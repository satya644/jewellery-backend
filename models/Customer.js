const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'] },
    phone: { type: String, required: [true, 'Phone number is required'], unique: true },
    email: { type: String, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    address: {
      line1: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
    },
    // Loyalty stamp card: 1 stamp per delivered order, 7 stamps = 1 completed reward
    stamps: { type: Number, default: 0 },
    completedCards: { type: Number, default: 0 },
    rewardsAvailable: { type: Number, default: 0 },
  },
  { timestamps: true }
);
customerSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
customerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model('Customer', customerSchema);
