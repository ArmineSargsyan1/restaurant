import {Router} from 'express';
import * as productController from '../controllers/products.js';
import validation from "../middlewares/validation.js";
import schema from "../schemas/products.schema.js";
import authorize from "../middlewares/authMiddlewere.js";

const router = Router({mergeParams: true});

router.post(
  '/',
  authorize,
  validation(schema.createProduct),
  productController.createProduct);

router.get(
  '/',
  authorize,
  validation(schema.getProductsByRestaurant),
  productController.getProductsByRestaurant);

router.get(
  '/:id',
  authorize,
  validation(schema.getProductById),
  productController.getProductById);

router.put(
  '/:id',
  authorize,
  validation(schema.updateProduct),
  productController.updateProduct);

router.delete(
  '/:id',
  authorize,
  validation(schema.deleteProduct),
  productController.deleteProduct);

export default router;
