const orderSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      price: {
        type: Number,
        required: true
      },
      customization: {
        color: String,
        size: String,
        additionalOptions: Map
      }
    }],
    totalAmount: {
      type: Number,
      required: true
    },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      pinCode: String,
      country: {
        type: String,
        default: 'India'
      }
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'googlepay'],
      required: true
    },
    paymentId: String,
    razorpayOrderId: String,
    deliveryDate: Date,
    orderId: {
      type: String,
      unique: true
    },
    appliedPromoCode: String,
    discount: {
      type: Number,
      default: 0
    },
    coinsUsed: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });