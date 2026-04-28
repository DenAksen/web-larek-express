import { Router } from 'express';
import createOrder from '../controllers/order.controller';
import { validateCreateOrder } from '../middleware/validations';

const router = Router();

router.post('/', validateCreateOrder, createOrder);

export default router;
