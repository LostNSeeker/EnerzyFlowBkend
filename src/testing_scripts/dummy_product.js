import Product from "../models/Product.js";
import { faker } from "@faker-js/faker"; // npm install @faker-js/faker

// Function to generate random products
const generateProducts = (count) => {
  const products = [];
  const categories = ["Customize Bottles", "General Purpose", "Special Offers"];
  
  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const sizeOptions = ["Small", "Medium", "Large", "XL"];
    const randomSizes = Array.from(
      { length: Math.floor(Math.random() * sizeOptions.length) + 1 },
      () => sizeOptions[Math.floor(Math.random() * sizeOptions.length)]
    );
    
    // Remove duplicates from sizes
    const sizes = [...new Set(randomSizes)];
    
    // Generate between 1-4 images
    const imageCount = Math.floor(Math.random() * 4) + 1;
    const images = Array.from({ length: imageCount }, () => faker.image.url());
    
    products.push({
      productId: faker.string.uuid(), // Add a unique productId
      name: faker.commerce.productName(),
      variant: Math.random() > 0.5 ? faker.commerce.productMaterial() : null,
      price: parseFloat(faker.commerce.price({ min: 5, max: 100 })),
      images: images,
      category: category,
      description: faker.commerce.productDescription(),
      inStock: Math.random() > 0.2, // 80% chance of being in stock
      rating: parseFloat((Math.random() * 5).toFixed(1)),
      totalReviews: Math.floor(Math.random() * 500),
      sizes: sizes,
      lotSize: Math.floor(Math.random() * 12) + 1 // Random lot size between 1 and 12
    });
  }
  
  return products;
};

// Function to seed the database
export const seedDatabase = async (count) => {
  try {
    console.log("Starting database seeding process");
    
    // Generate and insert new products
    const products = generateProducts(count);
    await Product.insertMany(products);
    
    console.log(`Successfully seeded ${count} products`);
    
    // Display a few example products
    const sampleProducts = await Product.find().limit(3);
    console.log("Sample products:");
    console.log(JSON.stringify(sampleProducts, null, 2));
    
  } catch (error) {
    console.error("Error seeding database:", error);
    // For debugging, log more details about the error
    if (error.writeErrors) {
      console.error("Write errors:", error.writeErrors);
    }
  }
};

// Optional: If you want to clear existing products before seeding
export const clearAndSeedDatabase = async (count) => {
  try {
    console.log("Clearing existing products");
    await Product.deleteMany({});
    console.log("Cleared existing products");
    
    // Now seed with new products
    await seedDatabase(count);
    
  } catch (error) {
    console.error("Error in clear and seed operation:", error);
  }
};