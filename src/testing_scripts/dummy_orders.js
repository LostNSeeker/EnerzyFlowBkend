import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { faker } from "@faker-js/faker";

// Function to generate random orders
export const seedOrders = async (count) => {
  try {
    console.log("Starting order seeding process...");

    // Get all products from the database
    const products = await Product.find({});
    if (products.length === 0) {
      throw new Error("No products found in the database. Please seed products first.");
    }
    console.log(`Found ${products.length} products to use for orders`);

    // Get all users from the database
    const users = await User.find({});
    if (users.length === 0) {
      throw new Error("No users found in the database. Please seed users first.");
    }
    console.log(`Found ${users.length} users to assign orders to`);

    const orders = [];
    const paymentMethods = ["cash", "upi", "card", "netbanking", "wallet", "emi"];
    const orderStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
    const paymentStatuses = ["pending", "completed", "failed"];

    for (let i = 0; i < count; i++) {
      // Randomly select a user
      const user = users[Math.floor(Math.random() * users.length)];

      // Generate between 1-5 items for the order
      const itemCount = Math.floor(Math.random() * 5) + 1;
      const items = [];
      let totalAmount = 0;

      // Create random order items
      for (let j = 0; j < itemCount; j++) {
        // Randomly select a product
        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 5) + 1;
        const price = product.price;
        
        items.push({
          product: product._id,
          quantity: quantity,
          price: price
        });

        totalAmount += price * quantity;
      }

      // Apply random discount (0-15%)
      const discountPercent = Math.random() * 0.15;
      const discount = Math.round(totalAmount * discountPercent * 100) / 100;
      const coinsUsed = Math.floor(Math.random() * 100);
      
      // Final total after discount and coins
      const finalTotal = Math.round((totalAmount - discount - (coinsUsed * 0.1)) * 100) / 100;

      // Create order object
      const order = {
        user: user._id,
        orderId: faker.string.uuid(),
        items: items,
        totalAmount: finalTotal > 0 ? finalTotal : 0, // Ensure total is not negative
        shippingAddress: {
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          pinCode: faker.location.zipCode(),
          phoneNumber: faker.phone.number(),
        },
        paymentStatus: faker.helpers.arrayElement(paymentStatuses),
        orderStatus: faker.helpers.arrayElement(orderStatuses),
        paymentMethod: faker.helpers.arrayElement(paymentMethods),
        paymentId: faker.string.uuid(),
        razorpayOrderId: `order_${faker.string.alphanumeric(14)}`,
        deliveryDate: faker.date.future(),
        appliedPromoCode: Math.random() > 0.7 ? `PROMO${faker.string.alphanumeric(5).toUpperCase()}` : null,
        discount: discount,
        coinsUsed: coinsUsed,
        createdAt: faker.date.recent({ days: 30 }),
      };

      orders.push(order);
    }

    // Insert orders into the database
    await Order.insertMany(orders);
    console.log(`Successfully seeded ${count} orders`);

    // Display a sample order
    const sampleOrder = await Order.findOne()
      .populate('user', 'Name phoneNumber') // Changed to match your User model fields
      .populate('items.product', 'name price')
      .exec();
    
    console.log("Sample order:");
    console.log(JSON.stringify(sampleOrder, null, 2));

    return { success: true, count };
  } catch (error) {
    console.error("Error seeding orders:", error);
    return { success: false, error: error.message };
  }
};

// Function to clear existing orders and seed new ones
export const clearAndSeedOrders = async (count) => {
  try {
    console.log("Clearing existing orders...");
    await Order.deleteMany({});
    console.log("All orders cleared");

    return await seedOrders(count);
  } catch (error) {
    console.error("Error in clear and seed operation:", error);
    return { success: false, error: error.message };
  }
};

// Example usage:
// import { seedOrders, clearAndSeedOrders } from './seedOrders.js';
// 
// // To add orders without clearing existing ones:
// seedOrders(10).then(result => console.log(result));
// 
// // To clear existing orders and add new ones:
// clearAndSeedOrders(10).then(result => console.log(result));