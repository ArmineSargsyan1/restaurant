import { Router } from 'express';

import controller from '../controllers/users.js'

import authorize from "../middlewares/authMiddlewere.js";
import validation from '../middlewares/validation.js';

import schema from '../schemas/user.schema.js';

const router = Router();

router.post(
  '/register',
  validation(schema.registration),
  controller.registration
);

router.post(
  '/login',
  validation(schema.login),
  controller.login,
);

router.get(
  '/profile',
  authorize,
  controller.profile
);




router.get('/views/registration', (req, res)=>{
  res.render('registration');
});

router.get('/views/login', (req, res)=>{
  res.render('login');
});

router.get('/views/profile', (req, res)=>{
  res.render('profile');
});

export default router;
