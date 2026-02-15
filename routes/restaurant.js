import { Router } from 'express';
import validation from '../middlewares/validation.js';
import schema from '../schemas/restaurant.schema.js';
import * as ControllerRestaurant from '../controllers/restaurant.js';
import productRoutes from "./product.js"

const router = Router();

router.use('/:restaurantId/products', productRoutes);

router.post(
  '/',
  validation(schema.createRestaurant),
  ControllerRestaurant.createRestaurant
);

router.get(
  '/',
  // validation(schema.getAllRestaurants),
  ControllerRestaurant.getAllRestaurants
);

router.get(
  '/nearby',
  // validation(schema.findNearbyRestaurants),
  ControllerRestaurant.findNearbyRestaurants
);

router.get(
  '/:id',
  validation(schema.getRestaurantById),
  ControllerRestaurant.getRestaurantById
);

router.put(
  '/:id',
  validation(schema.updateRestaurant),
  ControllerRestaurant.updateRestaurant
);

router.delete('/:id',
  validation(schema.getRestaurantById),
  ControllerRestaurant.deleteRestaurant);

export default router;
