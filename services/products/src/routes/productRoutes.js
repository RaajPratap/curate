const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

// Public routes
router.get('/', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/drops', productController.getDrops);
router.get('/:slug', productController.getProductBySlug);

// Admin routes (TODO: Add auth middleware)
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
