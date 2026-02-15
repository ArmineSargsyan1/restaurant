import {Restaurant} from '../models/index.js';
import Product from "../models/Products.js";


export const createRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.createRestaurant(req.body);

    const result = await Restaurant.findByPk(restaurant.id, {
      attributes: {exclude: ['location']}
    });

    return res.status(201).json({
      success: true,
      message: 'Restaurant created successfully',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
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
    const {id} = req.params;

    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    Restaurant.setLocationFields(req.body);

    await restaurant.update(req.body);

    const result = await Restaurant.findByPk(id, {
      attributes: {exclude: ['location']}
    });

    return res.status(200).json({
      success: true,
      message: 'Restaurant updated successfully',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteRestaurant = async (req, res) => {
  try {
    const {id} = req.params;

    const deleted = await Restaurant.deleteById(id);
    if (!deleted)
      return res
        .status(404)
        .json({status: 'error', message: 'Restaurant not found'});

    return res.json({status: 'ok', message: 'Restaurant deleted'});
  } catch (error) {
    return res.status(500).json({status: 'error', message: error.message});
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
