import Restaurant from '../models/Restaurant.js';

export const createRestaurant = async (req, res, next) => {
  console.log(req)
  try {
    const restaurant = await Restaurant.createRestaurant(req.body);
    console.log(restaurant, 333)
    res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      data: restaurant
    });
  } catch (err) {
    console.log(err)
    next(err);
  }
};

export const getAllRestaurants = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await Restaurant.getAll({
      page,
      limit,
      cuisine_type: req.query.cuisine_type,
      price_range: req.query.price_range
    });

    res.json({
      success: true,
      count: result.rows.length,
      total: result.count,
      page,
      totalPages: Math.ceil(result.count / limit),
      data: result.rows
    });
  } catch (err) {
    next(err);
  }
};

export const findNearbyRestaurants = async (req, res, next) => {
  const {latitude, longitude} = req.query
  try {
    const restaurants = await Restaurant.findNearby(req.query);
    // console.log(restaurants,3666)
    res.json({
      success: true,
      count: restaurants.length,
      search_location: {
        latitude,
        longitude
      },
      radius: Number(req.query.radius),
      unit: req.body.unit,
      data: restaurants
    });
  } catch (err) {
    next(err);
  }
};

export const getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.getById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant not found'
      });
    }

    res.json({success: true, data: restaurant});
  } catch (err) {
    next(err);
  }
};

export const updateRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.updateById(
      req.params.id,
      req.body
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant not found'
      });
    }

    res.json({
      success: true,
      message: "Restaurant updated successfully",
      data: restaurant
    });
  } catch (err) {
    next(err);
  }
};

export const deleteRestaurant = async (req, res, next) => {
  try {
    const success = await Restaurant.deleteById(req.params.id);
    if (!success)
      return res.status(404).json({success: false, error: 'Restaurant not found'});

    res.json({success: true, message: 'Restaurant deleted successfully'});
  } catch (err) {
    next(err);
  }
};

