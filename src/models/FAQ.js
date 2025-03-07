import mongoose from "mongoose";

const FAQSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  order: {
    type: Number,
    default: 0
    // For controlling display order within categories
  },
  isActive: {
    type: Boolean,
    default: true
    // To enable/disable FAQs without deleting them
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for faster querying by category
FAQSchema.index({ category: 1, order: 1 });

// Auto-update the updatedAt field on save
FAQSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create the model
const FAQ = mongoose.model('FAQ', FAQSchema);

export default FAQ;