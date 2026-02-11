import {Router} from 'express';

import restaurant from "./restaurant.js";


const router = Router();


router.use('/restaurant', restaurant);


export default router;
