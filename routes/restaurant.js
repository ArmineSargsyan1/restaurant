import {Router} from 'express';
import validation from '../middlewares/validation.js';
import schema from '../schemas/restaurant.schema.js';
import * as ControllerRestaurant from "../controllers/restaurant.js"


const router = Router();


router.post(
  '/',
  validation(schema.createRestaurant),
  ControllerRestaurant.createRestaurant
);
router.get('/',
  // validation(schema.getAllRestaurants),
  ControllerRestaurant.getAllRestaurants
);
router.get(
  '/nearby',
  validation(schema.findNearbyRestaurants),
  ControllerRestaurant.findNearbyRestaurants
);
router.get('/:id', ControllerRestaurant.getRestaurantById);
router.put('/:id', ControllerRestaurant.updateRestaurant);
router.delete('/:id', ControllerRestaurant.deleteRestaurant);


export default router;
