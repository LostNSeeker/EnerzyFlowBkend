// File: backend/routes/testRoutes.js
import express from 'express';
import Admin from '../models/Admin.js';

const router = express.Router();

/**
 * @route   POST /test/create-admin
 * @desc    Test route to create an admin
 * @access  Public (only for testing)
 */
// router.post('/create-admin', async (req, res) => {
//     console.log("in create admin body",req.body)
//   try {
//     const { name, email, password, role } = req.body;

//     // Basic validation
//     if (!name || !email || !password) {
//       return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
//     }

//     // Check if admin already exists
//     const existingAdmin = await Admin.findOne({ email });
//     if (existingAdmin) {
//       return res.status(400).json({ success: false, message: 'Admin with this email already exists' });
//     }

//     // Create new admin
//     const newAdmin = new Admin({
//       name,
//       email,
//       password,
//       role: role || 'admin' // Default to 'admin' if role not provided
//     });

//     await newAdmin.save();

//     // Return success without sending password
//     const adminResponse = {
//       _id: newAdmin._id,
//       name: newAdmin.name,
//       email: newAdmin.email,
//       role: newAdmin.role,
//       isActive: newAdmin.isActive,
//       createdAt: newAdmin.createdAt
//     };

//     return res.status(201).json({ 
//       success: true, 
//       message: 'Admin created successfully', 
//       admin: adminResponse 
//     });
//   } catch (error) {
//     console.error('Error creating test admin:', error);
//     return res.status(500).json({ success: false, message: 'Server error', error: error.message });
//   }
// });

// app.use("/dummyUsers",async (req, res )=>{
// 	await seedUsers(10)
// 	res.send("Dummy users Added")
// });
// app.use("/dummyProducts",async (req, res )=>{
// 	await seedDatabase(10)
// 	res.send("Dummy Products Added")
// });
// app.use("/dummyOrders",async (req, res )=>{
// 	await seedOrders(10)
// 	res.send("Dummy orders Added")
// });
// app.use("/createDummySettings",async (req, res )=>{
// 	await createDummySettings("60d21b4667d0d8992e610c85")
// 	res.send("Dummy settings created")
// });
// app.use("/seedFaq",async (req, res )=>{
// 	await seedFaq()
// 	res.send("seedFaq created")
// });

export default router;