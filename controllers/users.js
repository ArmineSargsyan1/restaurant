import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import User from '../models/User.js';

const { AUTH_SECRET, JWT_EXPIRES_IN } = process.env;

export default {

  async registration(req, res, next) {

    try {
      const { username, email, password } = req.body;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        if (req.file) {
          const filePath = path.normalize(req.file.path);
          fs.existsSync(filePath) && fs.unlinkSync(filePath);
        }

        return res.status(409).json({ success: false, error: 'Email already registered' });
      }

      const profilePicture = req.file
        ? path.normalize(req.file.path).replace(/\\/g, '/')
        : null;

      const user = await User.create({ username, email, password, profilePicture });

      const newUser = await User.findByPk(user.id, { attributes: { exclude: ['password'] } });

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: newUser
      });
    } catch (error) {

      if (req.file) {
        const filePath = path.normalize(req.file.path);
        fs.existsSync(filePath) && fs.unlinkSync(filePath);
      }
      next(error);
    }
  },


  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });

      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials',
        });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        AUTH_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      const data = await User.findByPk(user.id, {
        attributes: { exclude: ['password'] },
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

  async profile(req, res, next) {
    try {
      const user = await User.findByPk(req.userId, {
        attributes: { exclude: ['password'] },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      return res.json({
        success: true,
        user,
      });
    } catch (err) {
      next(err);
    }
  },

  async uploadProfilePicture(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded',
        });
      }

      const user = await User.findByPk(req.userId);
      console.log(user)
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      if (user.profilePicture) {
        try {
          fs.unlinkSync(user.profilePicture);
        } catch (e) {
          console.warn('Could not delete old picture:', e.message);
        }
      }

      const newPath = path.normalize(req.file.path).replace(/\\/g, '/');
      user.profilePicture = newPath;
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Profile picture updated',
        data: { profilePicture: user.profilePicture },
      });
    } catch (err) {
      next(err);
    }
  },
};
