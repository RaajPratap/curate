const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });

const Product = require("./models/Product");

// Mock products data matching the Product schema
const products = [
  {
    name: "Recycled Hoodie",
    description:
      "A comfortable and sustainable hoodie made from recycled materials. Perfect for everyday wear while reducing your environmental impact.",
    shortDescription: "Sustainable hoodie from recycled materials",
    price: 4999,
    compareAtPrice: 5999,
    currency: "INR",
    sku: "RH-001",
    trackInventory: true,
    variants: [
      {
        size: "S",
        color: { name: "Black", hex: "#000000" },
        sku: "RH-001-S-BLK",
        stock: 25,
      },
      {
        size: "M",
        color: { name: "Black", hex: "#000000" },
        sku: "RH-001-M-BLK",
        stock: 30,
      },
      {
        size: "L",
        color: { name: "Black", hex: "#000000" },
        sku: "RH-001-L-BLK",
        stock: 20,
      },
      {
        size: "S",
        color: { name: "Charcoal", hex: "#36454F" },
        sku: "RH-001-S-CHR",
        stock: 15,
      },
      {
        size: "M",
        color: { name: "Charcoal", hex: "#36454F" },
        sku: "RH-001-M-CHR",
        stock: 20,
      },
      {
        size: "L",
        color: { name: "Forest", hex: "#228B22" },
        sku: "RH-001-L-FOR",
        stock: 15,
      },
    ],
    images: [
      {
        url: "/images/products/hoodie-1.jpg",
        alt: "Recycled Hoodie Front",
        order: 1,
      },
      {
        url: "/images/products/hoodie-2.jpg",
        alt: "Recycled Hoodie Back",
        order: 2,
      },
    ],
    tags: ["hoodie", "recycled", "sustainable", "casual"],
    brand: "Curate Essentials",
    sustainability: {
      impactScore: 85,
      rating: "A",
      carbonFootprint: { production: 3.2, shipping: 1.0, total: 4.2 },
      materials: [
        {
          name: "Recycled Cotton",
          percentage: 60,
          isRecycled: true,
          isOrganic: false,
          certification: "GRS",
        },
        {
          name: "Recycled Polyester",
          percentage: 40,
          isRecycled: true,
          isOrganic: false,
          certification: "GRS",
        },
      ],
      manufacturing: {
        country: "India",
        factory: "EcoTextiles Mumbai",
        fairTrade: true,
      },
      packaging: { recyclable: true, compostable: true, plasticFree: true },
      certifications: ["GOTS", "Fair Trade", "Climate Neutral"],
    },
    details: {
      fit: "Regular fit",
      careInstructions: [
        "Machine wash cold",
        "Tumble dry low",
        "Do not bleach",
      ],
      madeIn: "India",
    },
    ratings: { average: 4.5, count: 128 },
    status: "active",
    isFeatured: true,
    isLimitedEdition: false,
    seo: {
      title: "Recycled Hoodie - Sustainable Fashion | Curate",
      description:
        "Shop our eco-friendly recycled hoodie made from sustainable materials.",
      keywords: ["recycled hoodie", "sustainable fashion", "eco-friendly"],
    },
  },
  {
    name: "Organic Cotton Tee",
    description:
      "Classic tee made from 100% organic cotton. Soft, breathable, and kind to the planet.",
    shortDescription: "Classic organic cotton t-shirt",
    price: 1499,
    currency: "INR",
    sku: "OCT-001",
    trackInventory: true,
    variants: [
      {
        size: "XS",
        color: { name: "White", hex: "#FFFFFF" },
        sku: "OCT-001-XS-WHT",
        stock: 50,
      },
      {
        size: "S",
        color: { name: "White", hex: "#FFFFFF" },
        sku: "OCT-001-S-WHT",
        stock: 60,
      },
      {
        size: "M",
        color: { name: "White", hex: "#FFFFFF" },
        sku: "OCT-001-M-WHT",
        stock: 70,
      },
      {
        size: "L",
        color: { name: "White", hex: "#FFFFFF" },
        sku: "OCT-001-L-WHT",
        stock: 50,
      },
      {
        size: "S",
        color: { name: "Black", hex: "#000000" },
        sku: "OCT-001-S-BLK",
        stock: 45,
      },
      {
        size: "M",
        color: { name: "Black", hex: "#000000" },
        sku: "OCT-001-M-BLK",
        stock: 55,
      },
      {
        size: "L",
        color: { name: "Navy", hex: "#000080" },
        sku: "OCT-001-L-NVY",
        stock: 40,
      },
    ],
    images: [
      {
        url: "/images/products/tee-1.jpg",
        alt: "Organic Cotton Tee",
        order: 1,
      },
    ],
    tags: ["tee", "organic", "cotton", "basics"],
    brand: "Curate Essentials",
    sustainability: {
      impactScore: 92,
      rating: "A",
      carbonFootprint: { production: 1.5, shipping: 0.6, total: 2.1 },
      materials: [
        {
          name: "Organic Cotton",
          percentage: 100,
          isRecycled: false,
          isOrganic: true,
          certification: "GOTS",
        },
      ],
      manufacturing: {
        country: "India",
        factory: "Green Threads Bangalore",
        fairTrade: true,
      },
      packaging: { recyclable: true, compostable: true, plasticFree: true },
      certifications: ["GOTS", "OEKO-TEX"],
    },
    details: {
      fit: "Regular fit",
      careInstructions: ["Machine wash cold", "Hang dry", "Iron on low"],
      madeIn: "India",
    },
    ratings: { average: 4.7, count: 312 },
    status: "active",
    isFeatured: true,
    isLimitedEdition: false,
  },
  {
    name: "Eco Cargo Pants",
    description:
      "Versatile cargo pants made from organic cotton and hemp blend. Durable, stylish, and eco-friendly.",
    shortDescription: "Organic cotton-hemp cargo pants",
    price: 5999,
    compareAtPrice: 7499,
    currency: "INR",
    sku: "ECP-001",
    trackInventory: true,
    variants: [
      {
        size: "28",
        color: { name: "Olive", hex: "#808000" },
        sku: "ECP-001-28-OLV",
        stock: 15,
      },
      {
        size: "30",
        color: { name: "Olive", hex: "#808000" },
        sku: "ECP-001-30-OLV",
        stock: 20,
      },
      {
        size: "32",
        color: { name: "Olive", hex: "#808000" },
        sku: "ECP-001-32-OLV",
        stock: 25,
      },
      {
        size: "32",
        color: { name: "Black", hex: "#000000" },
        sku: "ECP-001-32-BLK",
        stock: 20,
      },
      {
        size: "34",
        color: { name: "Sand", hex: "#C2B280" },
        sku: "ECP-001-34-SND",
        stock: 15,
      },
    ],
    images: [
      { url: "/images/products/cargo-1.jpg", alt: "Eco Cargo Pants", order: 1 },
    ],
    tags: ["pants", "cargo", "organic", "hemp"],
    brand: "Curate Urban",
    sustainability: {
      impactScore: 78,
      rating: "B",
      carbonFootprint: { production: 5.5, shipping: 1.3, total: 6.8 },
      materials: [
        {
          name: "Organic Cotton",
          percentage: 70,
          isRecycled: false,
          isOrganic: true,
          certification: "GOTS",
        },
        { name: "Hemp", percentage: 30, isRecycled: false, isOrganic: true },
      ],
      manufacturing: {
        country: "India",
        factory: "EcoTextiles Mumbai",
        fairTrade: true,
      },
      packaging: { recyclable: true, compostable: false, plasticFree: true },
      certifications: ["GOTS"],
    },
    details: {
      fit: "Relaxed fit",
      careInstructions: ["Machine wash cold", "Tumble dry low"],
      madeIn: "India",
    },
    ratings: { average: 4.3, count: 87 },
    status: "active",
    isFeatured: false,
    isLimitedEdition: false,
  },
  {
    name: "Limited Drop Jacket",
    description:
      "Exclusive limited edition jacket crafted from 100% recycled nylon. Water-resistant and climate neutral certified.",
    shortDescription: "Limited edition recycled nylon jacket",
    price: 11999,
    currency: "INR",
    sku: "LDJ-001",
    trackInventory: true,
    variants: [
      {
        size: "S",
        color: { name: "Black", hex: "#000000" },
        sku: "LDJ-001-S-BLK",
        stock: 5,
      },
      {
        size: "M",
        color: { name: "Black", hex: "#000000" },
        sku: "LDJ-001-M-BLK",
        stock: 8,
      },
      {
        size: "L",
        color: { name: "Black", hex: "#000000" },
        sku: "LDJ-001-L-BLK",
        stock: 7,
      },
      {
        size: "XL",
        color: { name: "Black", hex: "#000000" },
        sku: "LDJ-001-XL-BLK",
        stock: 5,
      },
    ],
    images: [
      {
        url: "/images/products/jacket-1.jpg",
        alt: "Limited Drop Jacket",
        order: 1,
      },
    ],
    tags: ["jacket", "limited", "recycled", "outerwear"],
    brand: "Curate Limited",
    sustainability: {
      impactScore: 88,
      rating: "A",
      carbonFootprint: { production: 7.0, shipping: 1.5, total: 8.5 },
      materials: [
        {
          name: "Recycled Nylon",
          percentage: 100,
          isRecycled: true,
          isOrganic: false,
          certification: "GRS",
        },
      ],
      manufacturing: {
        country: "Portugal",
        factory: "EcoFab Lisbon",
        fairTrade: true,
      },
      packaging: { recyclable: true, compostable: true, plasticFree: true },
      certifications: ["bluesign", "Climate Neutral", "GRS"],
    },
    details: {
      fit: "Regular fit",
      careInstructions: ["Hand wash cold", "Hang dry", "Do not iron"],
      madeIn: "Portugal",
    },
    ratings: { average: 4.9, count: 42 },
    status: "active",
    isFeatured: true,
    isLimitedEdition: true,
    dropDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    name: "Hemp Beanie",
    description:
      "Cozy beanie made from organic hemp and cotton. Naturally antibacterial and perfect for cooler weather.",
    shortDescription: "Organic hemp-cotton beanie",
    price: 999,
    currency: "INR",
    sku: "HB-001",
    trackInventory: true,
    variants: [
      {
        size: "One Size",
        color: { name: "Black", hex: "#000000" },
        sku: "HB-001-OS-BLK",
        stock: 50,
      },
      {
        size: "One Size",
        color: { name: "Charcoal", hex: "#36454F" },
        sku: "HB-001-OS-CHR",
        stock: 45,
      },
      {
        size: "One Size",
        color: { name: "Olive", hex: "#808000" },
        sku: "HB-001-OS-OLV",
        stock: 40,
      },
      {
        size: "One Size",
        color: { name: "Cream", hex: "#FFFDD0" },
        sku: "HB-001-OS-CRM",
        stock: 35,
      },
    ],
    images: [
      { url: "/images/products/beanie-1.jpg", alt: "Hemp Beanie", order: 1 },
    ],
    tags: ["beanie", "hemp", "accessories", "winter"],
    brand: "Curate Essentials",
    sustainability: {
      impactScore: 95,
      rating: "A",
      carbonFootprint: { production: 0.5, shipping: 0.3, total: 0.8 },
      materials: [
        {
          name: "Organic Hemp",
          percentage: 70,
          isRecycled: false,
          isOrganic: true,
        },
        {
          name: "Organic Cotton",
          percentage: 30,
          isRecycled: false,
          isOrganic: true,
          certification: "GOTS",
        },
      ],
      manufacturing: {
        country: "India",
        factory: "Hemp Works Delhi",
        fairTrade: true,
      },
      packaging: { recyclable: true, compostable: true, plasticFree: true },
      certifications: ["GOTS"],
    },
    details: {
      fit: "One size fits most",
      careInstructions: ["Hand wash cold", "Lay flat to dry"],
      madeIn: "India",
    },
    ratings: { average: 4.6, count: 156 },
    status: "active",
    isFeatured: false,
    isLimitedEdition: false,
  },
  {
    name: "Vintage Wash Crewneck",
    description:
      "Pre-washed crewneck sweatshirt with a lived-in feel. Made from organic cotton blend.",
    shortDescription: "Vintage-style organic crewneck",
    price: 3499,
    currency: "INR",
    sku: "VWC-001",
    trackInventory: true,
    variants: [
      {
        size: "S",
        color: { name: "Washed Black", hex: "#3D3D3D" },
        sku: "VWC-001-S-WBK",
        stock: 20,
      },
      {
        size: "M",
        color: { name: "Washed Black", hex: "#3D3D3D" },
        sku: "VWC-001-M-WBK",
        stock: 25,
      },
      {
        size: "L",
        color: { name: "Washed Black", hex: "#3D3D3D" },
        sku: "VWC-001-L-WBK",
        stock: 20,
      },
      {
        size: "M",
        color: { name: "Washed Blue", hex: "#6699CC" },
        sku: "VWC-001-M-WBL",
        stock: 18,
      },
      {
        size: "L",
        color: { name: "Washed Olive", hex: "#6B8E23" },
        sku: "VWC-001-L-WOV",
        stock: 15,
      },
    ],
    images: [
      {
        url: "/images/products/crew-1.jpg",
        alt: "Vintage Wash Crewneck",
        order: 1,
      },
    ],
    tags: ["crewneck", "sweatshirt", "vintage", "organic"],
    brand: "Curate Vintage",
    sustainability: {
      impactScore: 75,
      rating: "B",
      carbonFootprint: { production: 4.0, shipping: 1.2, total: 5.2 },
      materials: [
        {
          name: "Organic Cotton",
          percentage: 80,
          isRecycled: false,
          isOrganic: true,
          certification: "GOTS",
        },
        {
          name: "Recycled Polyester",
          percentage: 20,
          isRecycled: true,
          isOrganic: false,
        },
      ],
      manufacturing: {
        country: "India",
        factory: "Green Threads Bangalore",
        fairTrade: false,
      },
      packaging: { recyclable: true, compostable: false, plasticFree: true },
      certifications: ["OEKO-TEX"],
    },
    details: {
      fit: "Relaxed fit",
      careInstructions: ["Machine wash cold", "Tumble dry low"],
      madeIn: "India",
    },
    ratings: { average: 4.4, count: 98 },
    status: "active",
    isFeatured: false,
    isLimitedEdition: false,
  },
  {
    name: "Deadstock Joggers",
    description:
      "Comfortable joggers made from rescued deadstock cotton fabric. Each piece helps reduce textile waste.",
    shortDescription: "Joggers from rescued deadstock fabric",
    price: 3999,
    currency: "INR",
    sku: "DSJ-001",
    trackInventory: true,
    variants: [
      {
        size: "S",
        color: { name: "Black", hex: "#000000" },
        sku: "DSJ-001-S-BLK",
        stock: 12,
      },
      {
        size: "M",
        color: { name: "Black", hex: "#000000" },
        sku: "DSJ-001-M-BLK",
        stock: 15,
      },
      {
        size: "L",
        color: { name: "Black", hex: "#000000" },
        sku: "DSJ-001-L-BLK",
        stock: 10,
      },
      {
        size: "M",
        color: { name: "Heather Grey", hex: "#9AA297" },
        sku: "DSJ-001-M-HGR",
        stock: 12,
      },
      {
        size: "L",
        color: { name: "Heather Grey", hex: "#9AA297" },
        sku: "DSJ-001-L-HGR",
        stock: 10,
      },
    ],
    images: [
      {
        url: "/images/products/joggers-1.jpg",
        alt: "Deadstock Joggers",
        order: 1,
      },
    ],
    tags: ["joggers", "deadstock", "sustainable", "casual"],
    brand: "Curate Reclaimed",
    sustainability: {
      impactScore: 90,
      rating: "A",
      carbonFootprint: { production: 2.5, shipping: 1.0, total: 3.5 },
      materials: [
        {
          name: "Deadstock Cotton",
          percentage: 85,
          isRecycled: true,
          isOrganic: false,
        },
        {
          name: "Elastane",
          percentage: 15,
          isRecycled: false,
          isOrganic: false,
        },
      ],
      manufacturing: {
        country: "India",
        factory: "Reclaim Studios Mumbai",
        fairTrade: true,
      },
      packaging: { recyclable: true, compostable: true, plasticFree: true },
      certifications: ["Deadstock Certified"],
    },
    details: {
      fit: "Tapered fit",
      careInstructions: ["Machine wash cold", "Hang dry"],
      madeIn: "India",
    },
    ratings: { average: 4.5, count: 67 },
    status: "active",
    isFeatured: true,
    isLimitedEdition: false,
  },
  {
    name: "Oversized Graphic Tee",
    description:
      "Oversized fit graphic tee printed with water-based inks on organic cotton.",
    shortDescription: "Oversized organic cotton graphic tee",
    price: 1999,
    currency: "INR",
    sku: "OGT-001",
    trackInventory: true,
    variants: [
      {
        size: "S",
        color: { name: "Black", hex: "#000000" },
        sku: "OGT-001-S-BLK",
        stock: 0,
      },
      {
        size: "M",
        color: { name: "Black", hex: "#000000" },
        sku: "OGT-001-M-BLK",
        stock: 0,
      },
      {
        size: "L",
        color: { name: "Black", hex: "#000000" },
        sku: "OGT-001-L-BLK",
        stock: 0,
      },
      {
        size: "M",
        color: { name: "White", hex: "#FFFFFF" },
        sku: "OGT-001-M-WHT",
        stock: 0,
      },
    ],
    images: [
      {
        url: "/images/products/graphic-1.jpg",
        alt: "Oversized Graphic Tee",
        order: 1,
      },
    ],
    tags: ["tee", "graphic", "oversized", "organic"],
    brand: "Curate Essentials",
    sustainability: {
      impactScore: 80,
      rating: "B",
      carbonFootprint: { production: 2.0, shipping: 0.8, total: 2.8 },
      materials: [
        {
          name: "Organic Cotton",
          percentage: 100,
          isRecycled: false,
          isOrganic: true,
          certification: "GOTS",
        },
      ],
      manufacturing: {
        country: "India",
        factory: "Green Threads Bangalore",
        fairTrade: true,
      },
      packaging: { recyclable: true, compostable: true, plasticFree: true },
      certifications: ["GOTS", "Water-Based Inks"],
    },
    details: {
      fit: "Oversized fit",
      careInstructions: [
        "Machine wash cold inside out",
        "Hang dry",
        "Do not bleach",
      ],
      madeIn: "India",
    },
    ratings: { average: 4.2, count: 203 },
    status: "active",
    isFeatured: false,
    isLimitedEdition: false,
  },
  {
    name: "Recycled Bomber Jacket",
    description:
      "Classic bomber jacket made from recycled polyester. Lightweight, warm, and sustainable.",
    shortDescription: "Classic recycled polyester bomber",
    price: 8999,
    currency: "INR",
    sku: "RBJ-001",
    trackInventory: true,
    variants: [
      {
        size: "S",
        color: { name: "Black", hex: "#000000" },
        sku: "RBJ-001-S-BLK",
        stock: 10,
      },
      {
        size: "M",
        color: { name: "Black", hex: "#000000" },
        sku: "RBJ-001-M-BLK",
        stock: 12,
      },
      {
        size: "L",
        color: { name: "Olive", hex: "#808000" },
        sku: "RBJ-001-L-OLV",
        stock: 8,
      },
      {
        size: "M",
        color: { name: "Navy", hex: "#000080" },
        sku: "RBJ-001-M-NVY",
        stock: 10,
      },
    ],
    images: [
      {
        url: "/images/products/bomber-1.jpg",
        alt: "Recycled Bomber Jacket",
        order: 1,
      },
    ],
    tags: ["bomber", "jacket", "recycled", "outerwear"],
    brand: "Curate Urban",
    sustainability: {
      impactScore: 87,
      rating: "A",
      carbonFootprint: { production: 5.8, shipping: 1.4, total: 7.2 },
      materials: [
        {
          name: "Recycled Polyester",
          percentage: 100,
          isRecycled: true,
          isOrganic: false,
          certification: "GRS",
        },
      ],
      manufacturing: {
        country: "Vietnam",
        factory: "EcoGarment Hanoi",
        fairTrade: true,
      },
      packaging: { recyclable: true, compostable: true, plasticFree: true },
      certifications: ["GRS", "Climate Neutral"],
    },
    details: {
      fit: "Regular fit",
      careInstructions: ["Machine wash cold", "Tumble dry low", "Do not iron"],
      madeIn: "Vietnam",
    },
    ratings: { average: 4.6, count: 54 },
    status: "active",
    isFeatured: true,
    isLimitedEdition: false,
  },
  {
    name: "Organic Cotton Shorts",
    description:
      "Relaxed fit shorts made from certified organic cotton. Perfect for summer.",
    shortDescription: "Relaxed organic cotton shorts",
    price: 2499,
    currency: "INR",
    sku: "OCS-001",
    trackInventory: true,
    variants: [
      {
        size: "S",
        color: { name: "Black", hex: "#000000" },
        sku: "OCS-001-S-BLK",
        stock: 35,
      },
      {
        size: "M",
        color: { name: "Black", hex: "#000000" },
        sku: "OCS-001-M-BLK",
        stock: 40,
      },
      {
        size: "L",
        color: { name: "Khaki", hex: "#C3B091" },
        sku: "OCS-001-L-KHK",
        stock: 30,
      },
      {
        size: "M",
        color: { name: "Navy", hex: "#000080" },
        sku: "OCS-001-M-NVY",
        stock: 35,
      },
    ],
    images: [
      {
        url: "/images/products/shorts-1.jpg",
        alt: "Organic Cotton Shorts",
        order: 1,
      },
    ],
    tags: ["shorts", "organic", "summer", "basics"],
    brand: "Curate Essentials",
    sustainability: {
      impactScore: 91,
      rating: "A",
      carbonFootprint: { production: 1.8, shipping: 0.7, total: 2.5 },
      materials: [
        {
          name: "Organic Cotton",
          percentage: 100,
          isRecycled: false,
          isOrganic: true,
          certification: "GOTS",
        },
      ],
      manufacturing: {
        country: "India",
        factory: "Green Threads Bangalore",
        fairTrade: true,
      },
      packaging: { recyclable: true, compostable: true, plasticFree: true },
      certifications: ["GOTS"],
    },
    details: {
      fit: "Relaxed fit",
      careInstructions: ["Machine wash cold", "Tumble dry low"],
      madeIn: "India",
    },
    ratings: { average: 4.4, count: 145 },
    status: "active",
    isFeatured: false,
    isLimitedEdition: false,
  },
  {
    name: "Upcycled Denim Jacket",
    description:
      "One-of-a-kind denim jacket created from upcycled vintage denim. Each piece is unique.",
    shortDescription: "Unique upcycled vintage denim jacket",
    price: 7499,
    currency: "INR",
    sku: "UDJ-001",
    trackInventory: true,
    variants: [
      {
        size: "S",
        color: { name: "Vintage Blue", hex: "#4169E1" },
        sku: "UDJ-001-S-VBL",
        stock: 3,
      },
      {
        size: "M",
        color: { name: "Vintage Blue", hex: "#4169E1" },
        sku: "UDJ-001-M-VBL",
        stock: 5,
      },
      {
        size: "L",
        color: { name: "Vintage Blue", hex: "#4169E1" },
        sku: "UDJ-001-L-VBL",
        stock: 4,
      },
      {
        size: "M",
        color: { name: "Vintage Black", hex: "#1C1C1C" },
        sku: "UDJ-001-M-VBK",
        stock: 3,
      },
    ],
    images: [
      {
        url: "/images/products/denim-1.jpg",
        alt: "Upcycled Denim Jacket",
        order: 1,
      },
    ],
    tags: ["denim", "jacket", "upcycled", "vintage", "limited"],
    brand: "Curate Reclaimed",
    sustainability: {
      impactScore: 98,
      rating: "A",
      carbonFootprint: { production: 1.0, shipping: 0.5, total: 1.5 },
      materials: [
        {
          name: "Upcycled Denim",
          percentage: 100,
          isRecycled: true,
          isOrganic: false,
        },
      ],
      manufacturing: {
        country: "India",
        factory: "Reclaim Studios Mumbai",
        fairTrade: true,
      },
      packaging: { recyclable: true, compostable: true, plasticFree: true },
      certifications: ["Upcycled Certified"],
    },
    details: {
      fit: "Classic fit",
      careInstructions: ["Spot clean only", "Hang dry"],
      madeIn: "India",
    },
    ratings: { average: 4.8, count: 28 },
    status: "active",
    isFeatured: false,
    isLimitedEdition: true,
  },
  {
    name: "Bamboo Socks Pack",
    description:
      "Pack of 3 pairs of ultra-soft bamboo socks. Naturally moisture-wicking and antibacterial.",
    shortDescription: "3-pack bamboo socks",
    price: 799,
    currency: "INR",
    sku: "BSP-001",
    trackInventory: true,
    variants: [
      {
        size: "S/M",
        color: { name: "Mixed Pack", hex: "#808080" },
        sku: "BSP-001-SM-MIX",
        stock: 100,
      },
      {
        size: "L/XL",
        color: { name: "Mixed Pack", hex: "#808080" },
        sku: "BSP-001-LX-MIX",
        stock: 80,
      },
      {
        size: "S/M",
        color: { name: "All Black", hex: "#000000" },
        sku: "BSP-001-SM-BLK",
        stock: 120,
      },
      {
        size: "L/XL",
        color: { name: "All Black", hex: "#000000" },
        sku: "BSP-001-LX-BLK",
        stock: 100,
      },
      {
        size: "S/M",
        color: { name: "All White", hex: "#FFFFFF" },
        sku: "BSP-001-SM-WHT",
        stock: 90,
      },
    ],
    images: [
      {
        url: "/images/products/socks-1.jpg",
        alt: "Bamboo Socks Pack",
        order: 1,
      },
    ],
    tags: ["socks", "bamboo", "accessories", "basics"],
    brand: "Curate Essentials",
    sustainability: {
      impactScore: 94,
      rating: "A",
      carbonFootprint: { production: 0.3, shipping: 0.2, total: 0.5 },
      materials: [
        { name: "Bamboo", percentage: 80, isRecycled: false, isOrganic: true },
        {
          name: "Organic Cotton",
          percentage: 15,
          isRecycled: false,
          isOrganic: true,
        },
        {
          name: "Elastane",
          percentage: 5,
          isRecycled: false,
          isOrganic: false,
        },
      ],
      manufacturing: {
        country: "India",
        factory: "BambooTex Chennai",
        fairTrade: true,
      },
      packaging: { recyclable: true, compostable: true, plasticFree: true },
      certifications: ["OEKO-TEX"],
    },
    details: {
      fit: "Regular fit",
      careInstructions: ["Machine wash cold", "Tumble dry low"],
      madeIn: "India",
    },
    ratings: { average: 4.7, count: 389 },
    status: "active",
    isFeatured: false,
    isLimitedEdition: false,
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Use save() instead of insertMany() to trigger pre-save hooks (for slug generation)
    const savedProducts = [];
    for (const productData of products) {
      const product = new Product(productData);
      await product.save();
      savedProducts.push(product);
    }
    console.log(`Seeded ${savedProducts.length} products`);

    console.log("\n--- Product Summary ---");
    savedProducts.forEach((product) => {
      const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
      console.log(
        `  ${product.name} (${product.slug}) - ₹${product.price} (Stock: ${totalStock})`,
      );
    });

    console.log("\nProducts seeding completed!");
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedProducts();
