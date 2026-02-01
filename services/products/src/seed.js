const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');

// Mock products data (from frontend mock-data.ts, converted to JS)
const products = [
  {
    name: 'Recycled Hoodie',
    slug: 'recycled-hoodie',
    description: 'A comfortable and sustainable hoodie made from recycled materials. Perfect for everyday wear while reducing your environmental impact.',
    price: 4999,
    category: 'hoodies',
    colors: ['Black', 'Charcoal', 'Forest', 'Sand'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: ['/images/products/hoodie-1.jpg', '/images/products/hoodie-2.jpg'],
    sustainability: {
      ecoRating: 'A',
      carbonFootprint: 4.2,
      materials: [
        { name: 'Recycled Cotton', percentage: 60 },
        { name: 'Recycled Polyester', percentage: 40 },
      ],
      certifications: ['GOTS', 'Fair Trade', 'Climate Neutral'],
    },
    stock: 150,
    isActive: true,
    isNew: true,
    isFeatured: true,
    isLimitedEdition: false,
  },
  {
    name: 'Organic Tee',
    slug: 'organic-tee',
    description: 'Classic tee made from 100% organic cotton. Soft, breathable, and kind to the planet.',
    price: 1499,
    category: 'tees',
    colors: ['White', 'Black', 'Navy'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    images: ['/images/products/tee-1.jpg'],
    sustainability: {
      ecoRating: 'A',
      carbonFootprint: 2.1,
      materials: [
        { name: 'Organic Cotton', percentage: 100 },
      ],
      certifications: ['GOTS', 'OEKO-TEX'],
    },
    stock: 300,
    isActive: true,
    isNew: false,
    isFeatured: true,
    isLimitedEdition: false,
  },
  {
    name: 'Eco Cargo Pants',
    slug: 'eco-cargo-pants',
    description: 'Versatile cargo pants made from organic cotton and hemp blend. Durable, stylish, and eco-friendly.',
    price: 5999,
    compareAtPrice: 7499,
    category: 'bottoms',
    colors: ['Olive', 'Black', 'Sand'],
    sizes: ['28', '30', '32', '34', '36'],
    images: ['/images/products/cargo-1.jpg'],
    sustainability: {
      ecoRating: 'B',
      carbonFootprint: 6.8,
      materials: [
        { name: 'Organic Cotton', percentage: 70 },
        { name: 'Hemp', percentage: 30 },
      ],
      certifications: ['GOTS'],
    },
    stock: 80,
    isActive: true,
    isNew: false,
    isFeatured: false,
    isLimitedEdition: false,
  },
  {
    name: 'Limited Drop Jacket',
    slug: 'limited-drop-jacket',
    description: 'Exclusive limited edition jacket crafted from 100% recycled nylon. Water-resistant and climate neutral certified.',
    price: 11999,
    category: 'outerwear',
    colors: ['Black'],
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/images/products/jacket-1.jpg'],
    sustainability: {
      ecoRating: 'A',
      carbonFootprint: 8.5,
      materials: [
        { name: 'Recycled Nylon', percentage: 100 },
      ],
      certifications: ['bluesign', 'Climate Neutral'],
    },
    stock: 25,
    isActive: true,
    isNew: true,
    isFeatured: true,
    isLimitedEdition: true,
    drop: {
      releaseDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      totalUnits: 50,
      soldUnits: 25,
    },
  },
  {
    name: 'Hemp Beanie',
    slug: 'hemp-beanie',
    description: 'Cozy beanie made from organic hemp and cotton. Naturally antibacterial and perfect for cooler weather.',
    price: 999,
    category: 'accessories',
    colors: ['Black', 'Charcoal', 'Olive', 'Cream'],
    sizes: ['One Size'],
    images: ['/images/products/beanie-1.jpg'],
    sustainability: {
      ecoRating: 'A',
      carbonFootprint: 0.8,
      materials: [
        { name: 'Organic Hemp', percentage: 70 },
        { name: 'Organic Cotton', percentage: 30 },
      ],
      certifications: ['GOTS'],
    },
    stock: 200,
    isActive: true,
    isNew: false,
    isFeatured: false,
    isLimitedEdition: false,
  },
  {
    name: 'Vintage Wash Crewneck',
    slug: 'vintage-wash-crewneck',
    description: 'Pre-washed crewneck sweatshirt with a lived-in feel. Made from organic cotton blend.',
    price: 3499,
    category: 'sweatshirts',
    colors: ['Washed Black', 'Washed Blue', 'Washed Olive'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: ['/images/products/crew-1.jpg'],
    sustainability: {
      ecoRating: 'B',
      carbonFootprint: 5.2,
      materials: [
        { name: 'Organic Cotton', percentage: 80 },
        { name: 'Recycled Polyester', percentage: 20 },
      ],
      certifications: ['OEKO-TEX'],
    },
    stock: 120,
    isActive: true,
    isNew: false,
    isFeatured: false,
    isLimitedEdition: false,
  },
  {
    name: 'Deadstock Joggers',
    slug: 'deadstock-joggers',
    description: 'Comfortable joggers made from rescued deadstock cotton fabric. Each piece helps reduce textile waste.',
    price: 3999,
    category: 'bottoms',
    colors: ['Black', 'Heather Grey'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: ['/images/products/joggers-1.jpg'],
    sustainability: {
      ecoRating: 'A',
      carbonFootprint: 3.5,
      materials: [
        { name: 'Deadstock Cotton', percentage: 85 },
        { name: 'Elastane', percentage: 15 },
      ],
      certifications: ['Deadstock Certified'],
    },
    stock: 60,
    isActive: true,
    isNew: true,
    isFeatured: true,
    isLimitedEdition: false,
  },
  {
    name: 'Oversized Graphic Tee',
    slug: 'oversized-graphic-tee',
    description: 'Oversized fit graphic tee printed with water-based inks on organic cotton.',
    price: 1999,
    category: 'tees',
    colors: ['Black', 'White'],
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/images/products/graphic-1.jpg'],
    sustainability: {
      ecoRating: 'B',
      carbonFootprint: 2.8,
      materials: [
        { name: 'Organic Cotton', percentage: 100 },
      ],
      certifications: ['GOTS', 'Water-Based Inks'],
    },
    stock: 0, // Sold out
    isActive: true,
    isNew: false,
    isFeatured: false,
    isLimitedEdition: false,
  },
  // Additional products for variety
  {
    name: 'Recycled Bomber Jacket',
    slug: 'recycled-bomber-jacket',
    description: 'Classic bomber jacket made from recycled polyester. Lightweight, warm, and sustainable.',
    price: 8999,
    category: 'outerwear',
    colors: ['Black', 'Olive', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/images/products/bomber-1.jpg'],
    sustainability: {
      ecoRating: 'A',
      carbonFootprint: 7.2,
      materials: [
        { name: 'Recycled Polyester', percentage: 100 },
      ],
      certifications: ['GRS', 'Climate Neutral'],
    },
    stock: 45,
    isActive: true,
    isNew: true,
    isFeatured: true,
    isLimitedEdition: false,
  },
  {
    name: 'Organic Cotton Shorts',
    slug: 'organic-cotton-shorts',
    description: 'Relaxed fit shorts made from certified organic cotton. Perfect for summer.',
    price: 2499,
    category: 'bottoms',
    colors: ['Black', 'Khaki', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/images/products/shorts-1.jpg'],
    sustainability: {
      ecoRating: 'A',
      carbonFootprint: 2.5,
      materials: [
        { name: 'Organic Cotton', percentage: 100 },
      ],
      certifications: ['GOTS'],
    },
    stock: 180,
    isActive: true,
    isNew: false,
    isFeatured: false,
    isLimitedEdition: false,
  },
  {
    name: 'Upcycled Denim Jacket',
    slug: 'upcycled-denim-jacket',
    description: 'One-of-a-kind denim jacket created from upcycled vintage denim. Each piece is unique.',
    price: 7499,
    category: 'outerwear',
    colors: ['Vintage Blue', 'Vintage Black'],
    sizes: ['S', 'M', 'L'],
    images: ['/images/products/denim-1.jpg'],
    sustainability: {
      ecoRating: 'A',
      carbonFootprint: 1.5,
      materials: [
        { name: 'Upcycled Denim', percentage: 100 },
      ],
      certifications: ['Upcycled Certified'],
    },
    stock: 15,
    isActive: true,
    isNew: true,
    isFeatured: false,
    isLimitedEdition: true,
  },
  {
    name: 'Bamboo Socks Pack',
    slug: 'bamboo-socks-pack',
    description: 'Pack of 3 pairs of ultra-soft bamboo socks. Naturally moisture-wicking and antibacterial.',
    price: 799,
    category: 'accessories',
    colors: ['Mixed Pack', 'All Black', 'All White'],
    sizes: ['S/M', 'L/XL'],
    images: ['/images/products/socks-1.jpg'],
    sustainability: {
      ecoRating: 'A',
      carbonFootprint: 0.5,
      materials: [
        { name: 'Bamboo', percentage: 80 },
        { name: 'Organic Cotton', percentage: 15 },
        { name: 'Elastane', percentage: 5 },
      ],
      certifications: ['OEKO-TEX'],
    },
    stock: 500,
    isActive: true,
    isNew: false,
    isFeatured: false,
    isLimitedEdition: false,
  },
];

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/curate_products');
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    const result = await Product.insertMany(products);
    console.log(`Seeded ${result.length} products`);

    // Display summary
    console.log('\n--- Product Summary ---');
    result.forEach(product => {
      console.log(`  ${product.name} - ₹${product.price} (${product.category})`);
    });

    console.log('\nSeeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

// Run seed
seedProducts();
