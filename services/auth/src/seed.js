const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });

const User = require("./models/User");

// Mock users data
const users = [
  {
    email: "admin@curate.com",
    password: "Admin@123456",
    username: "admin",
    firstName: "Admin",
    lastName: "User",
    phone: "+91-9876543210",
    role: "admin",
    isVerified: true,
    addresses: [
      {
        label: "Office",
        street: "123 Admin Street",
        apartment: "Suite 100",
        city: "Mumbai",
        state: "Maharashtra",
        zipCode: "400001",
        country: "India",
        isDefault: true,
      },
    ],
    preferences: {
      newsletter: true,
      smsNotifications: true,
      sustainabilityAlerts: true,
      theme: "dark",
    },
    impact: {
      totalCarbonSaved: 150.5,
      totalWaterSaved: 2500,
      sustainabilityScore: 85,
      badges: [
        { name: "Eco Warrior", earnedAt: new Date("2024-01-15") },
        { name: "Carbon Crusher", earnedAt: new Date("2024-03-20") },
      ],
    },
  },
  {
    email: "john.doe@example.com",
    password: "User@123456",
    username: "johndoe",
    firstName: "John",
    lastName: "Doe",
    phone: "+91-9876543211",
    dateOfBirth: new Date("1990-05-15"),
    role: "customer",
    isVerified: true,
    addresses: [
      {
        label: "Home",
        street: "456 Green Lane",
        apartment: "Apt 2B",
        city: "Bangalore",
        state: "Karnataka",
        zipCode: "560001",
        country: "India",
        isDefault: true,
      },
      {
        label: "Work",
        street: "789 Tech Park",
        apartment: "Floor 5",
        city: "Bangalore",
        state: "Karnataka",
        zipCode: "560002",
        country: "India",
        isDefault: false,
      },
    ],
    preferences: {
      newsletter: true,
      smsNotifications: false,
      sustainabilityAlerts: true,
      theme: "dark",
    },
    impact: {
      totalCarbonSaved: 45.2,
      totalWaterSaved: 800,
      sustainabilityScore: 62,
      badges: [{ name: "First Purchase", earnedAt: new Date("2024-02-10") }],
    },
  },
  {
    email: "priya.sharma@example.com",
    password: "User@123456",
    username: "priyasharma",
    firstName: "Priya",
    lastName: "Sharma",
    phone: "+91-9876543212",
    dateOfBirth: new Date("1995-08-22"),
    role: "customer",
    isVerified: true,
    addresses: [
      {
        label: "Home",
        street: "321 Eco Avenue",
        city: "Delhi",
        state: "Delhi",
        zipCode: "110001",
        country: "India",
        isDefault: true,
      },
    ],
    preferences: {
      newsletter: true,
      smsNotifications: true,
      sustainabilityAlerts: true,
      theme: "light",
    },
    impact: {
      totalCarbonSaved: 78.9,
      totalWaterSaved: 1200,
      sustainabilityScore: 75,
      badges: [
        { name: "First Purchase", earnedAt: new Date("2024-01-05") },
        { name: "Eco Starter", earnedAt: new Date("2024-02-15") },
      ],
    },
  },
  {
    email: "amit.patel@example.com",
    password: "User@123456",
    username: "amitpatel",
    firstName: "Amit",
    lastName: "Patel",
    phone: "+91-9876543213",
    dateOfBirth: new Date("1988-12-03"),
    role: "customer",
    isVerified: true,
    addresses: [
      {
        label: "Home",
        street: "555 Sustainable Street",
        apartment: "Block C, Flat 12",
        city: "Ahmedabad",
        state: "Gujarat",
        zipCode: "380001",
        country: "India",
        isDefault: true,
      },
    ],
    preferences: {
      newsletter: false,
      smsNotifications: false,
      sustainabilityAlerts: true,
      theme: "dark",
    },
    impact: {
      totalCarbonSaved: 120.3,
      totalWaterSaved: 1800,
      sustainabilityScore: 80,
      badges: [
        { name: "First Purchase", earnedAt: new Date("2023-11-20") },
        { name: "Eco Warrior", earnedAt: new Date("2024-04-01") },
      ],
    },
  },
  {
    email: "sara.khan@example.com",
    password: "User@123456",
    username: "sarakhan",
    firstName: "Sara",
    lastName: "Khan",
    phone: "+91-9876543214",
    dateOfBirth: new Date("1992-03-18"),
    role: "customer",
    isVerified: false,
    addresses: [],
    preferences: {
      newsletter: true,
      smsNotifications: false,
      sustainabilityAlerts: true,
      theme: "dark",
    },
    impact: {
      totalCarbonSaved: 0,
      totalWaterSaved: 0,
      sustainabilityScore: 0,
      badges: [],
    },
  },
  {
    email: "demo@curate.com",
    password: "Demo@123456",
    username: "demouser",
    firstName: "Demo",
    lastName: "User",
    phone: "+91-9876543215",
    role: "customer",
    isVerified: true,
    addresses: [
      {
        label: "Home",
        street: "100 Demo Street",
        city: "Mumbai",
        state: "Maharashtra",
        zipCode: "400002",
        country: "India",
        isDefault: true,
      },
    ],
    preferences: {
      newsletter: true,
      smsNotifications: false,
      sustainabilityAlerts: true,
      theme: "dark",
    },
    impact: {
      totalCarbonSaved: 25.0,
      totalWaterSaved: 400,
      sustainabilityScore: 40,
      badges: [{ name: "First Purchase", earnedAt: new Date("2024-05-01") }],
    },
  },
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    await User.deleteMany({});
    console.log("Cleared existing users");

    // Insert users one by one to trigger password hashing
    const createdUsers = [];
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }
    console.log(`Seeded ${createdUsers.length} users`);

    console.log("\n--- User Summary ---");
    createdUsers.forEach((user) => {
      console.log(
        `  ${user.email} (${user.role}) - ${user.firstName} ${user.lastName}`,
      );
    });

    console.log("\n--- Test Credentials ---");
    console.log("  Admin: admin@curate.com / Admin@123456");
    console.log("  Demo:  demo@curate.com / Demo@123456");

    console.log("\nUsers seeding completed!");
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedUsers();
