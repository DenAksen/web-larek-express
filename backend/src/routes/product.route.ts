import { Router } from 'express';
import { getAllProducts, createProduct, getProductById } from '../controllers/product.controller';
import { validateCreateProduct, validateProductId } from '../middleware/validations';

const router = Router();

router.get('/', getAllProducts);

router.get('/:id', validateProductId, getProductById);

router.post('/', validateCreateProduct, createProduct);

export default router;
