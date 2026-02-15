import jwt from 'jsonwebtoken';

import User from '../models/User.js';

const {AUTH_SECRET, JWT_EXPIRES_IN} = process.env;

export default {
  async login(req, res, next) {
    try {
      const {email, password} = req.body;

      const user = await User.findOne({where: {email}});

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials',
        });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials',
        });
      }

      const token = jwt.sign(
        {id: user.id, email: user.email},
        AUTH_SECRET,
        {expiresIn: JWT_EXPIRES_IN}
      );

      const data = await User.findByPk(user.id, {
        attributes: { exclude: ['password'] }
      });


      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        data,
      });
    } catch (err) {
      next(err);
    }
  },


  async registration(req, res, next) {
    try {
      const {username, email, password} = req.body;

      const existingUser = await User.findOne({where: {email}});
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'Email already registered',
        });
      }

      const user = await User.create({username, email, password});


      const newUser = await User.findByPk(user.id, {
        attributes: {exclude: ['password']}
      });


      res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: newUser
      });
    } catch (err) {
      next(err);
    }
  },

  async profile(req, res, next) {

    try {
      const user = await User.findByPk(req.userId, {
        attributes: {exclude: ['password']}
      });

      if (!user) {
        return res.status(404).json({status: 'error', message: 'User not found'});
      }

      res.json({
        status: 'ok',
        user,
      });
    } catch (err) {
      next(err);
    }
  },
};
