import {Restaurant} from '../models/index.js';
import Product from "../models/Products.js";
import FileHelper from "../services/Utils.js";

export const createRestaurant = async (req, res) => {
  const coverImage = FileHelper.getFilePath(req.file);

  try {
    const restaurant = await Restaurant.create({
      ...req.body,
      coverImage,
    });

    const result = await Restaurant.findByPk(restaurant.id, {
      attributes: { exclude: ['location'] },
    });

    return res.status(201).json({
      success: true,
      message: 'Restaurant created successfully',
      data: result,
    });
  } catch (error) {
    FileHelper.deleteFile(coverImage);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllRestaurants = async (req, res) => {
  try {
    const {page = 1, limit = 10, cuisineType, priceRange} = req.query;

    const where = {};
    if (cuisineType) where.cuisineType = cuisineType;
    if (priceRange) where.priceRange = priceRange;

    const offset = (page - 1) * limit;

    const {count, rows} = await Restaurant.findAndCountAll({
      where,
      limit: Number(limit),
      offset: Number(offset),
      attributes: {exclude: ['location']},
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      count: rows.length,
      total: count,
      page: Number(page),
      totalPages: Math.ceil(count / limit),
      data: rows
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const getRestaurantById = async (req, res) => {
  try {
    const {id} = req.params;

    const restaurant = await Restaurant.findByPk(id, {
      include: {model: Product, as: 'products'},
      attributes: {exclude: ['location']},
    });

    if (!restaurant)
      return res
        .status(404)
        .json({status: 'error', message: 'Restaurant not found'});

    return res.json({status: 'ok', data: restaurant});
  } catch (error) {
    return res.status(500).json({status: 'error', message: error.message});
  }
};


export const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant) {

      if (req.file) FileHelper.deleteFile(req.file.path);

      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    if (req.file) {
      const newCover = FileHelper.getFilePath(req.file);

      if (restaurant.coverImage) {
        FileHelper.deleteFile(restaurant.coverImage);
      }

      req.body.coverImage = newCover;
    }

    Restaurant.setLocationFields(req.body);

    await restaurant.update(req.body);

    const result = await Restaurant.findByPk(id, {
      attributes: { exclude: ['location'] }
    });

    return res.status(200).json({
      success: true,
      message: 'Restaurant updated successfully',
      data: result
    });
  } catch (error) {
    if (req.file) FileHelper.deleteFile(req.file.path);

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant) {
      return res.status(404).json({
        status: 'error',
        message: 'Restaurant not found'
      });
    }

    if (restaurant.coverImage) {
      FileHelper.deleteFile(restaurant.coverImage);
    }

    await restaurant.destroy();

    return res.json({
      status: 'ok',
      message: 'Restaurant deleted'
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};


export const findNearbyRestaurants = async (req, res) => {
  try {
    const {latitude, longitude, radius, page, limit, cuisineType, minRating} = req.query;

    const nearby = await Restaurant.findNearby({
      latitude,
      longitude,
      radius,
      page,
      limit,
      cuisineType,
      minRating
    });

    return res.json({status: 'ok', data: nearby});
  } catch (error) {
    return res.status(400).json({status: 'error', message: error.message});
  }
};
