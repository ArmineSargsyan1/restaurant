import {Restaurant} from '../models/index.js';
import Product from "../models/Products.js";

export const createProduct = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;

    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(404).json({success: false, error: 'Restaurant not found'});
    }

    const newProduct = await Product.create({
      ...req.body,
      restaurantId: Number(restaurantId)
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct
    });
  } catch (error) {
    return res.status(400).json({status: 'error', message: error.message});
  }
};

export const getProductsByRestaurant = async (req, res) => {
  try {
    const {restaurantId} = req.params;

    const id = Number(restaurantId);

    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    const {page = 1, limit = 10, category, isAvailable} = req.query;
    const offset = (page - 1) * limit;

    const where = {restaurantId: id};
    if (category) {
      where.category = category
    }

    if (isAvailable !== undefined) {
      where.isAvailable = isAvailable === 'true';
    }

    const {count, rows} = await Product.findAndCountAll({
      where,
      limit: Number(limit),
      offset: Number(offset),
      order: [['createdAt', 'DESC']]
    });

    const totalPages = Math.ceil(count / limit);
    const currentPage = Number(page);

    return res.status(200).json({
      success: true,
      count: rows.length,
      total: count,
      currentPage,
      totalPages,
      data: rows
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const {restaurantId, id: productId} = req.params;

    const rId = Number(restaurantId);
    const pId = Number(productId);

    const restaurant = await Restaurant.findByPk(rId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found"
      });
    }

    const product = await Product.findOne({
      where: {
        id: pId,
        restaurantId: rId
      },
      include: [
        {
          model: Restaurant,
          as: "restaurant",
          attributes: {exclude: ["location"]}
        }
      ]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const {restaurantId, id} = req.params;

    const rId = Number(restaurantId);
    const pId = Number(id);

    // const restaurant = await Restaurant.findByPk(rId);
    // if (!restaurant) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'Restaurant not found'
    //   });
    // }

    const product = await Product.findOne({
      where: {id: pId, restaurantId: rId}
    });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.update(req.body);

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const {restaurantId, id} = req.params;

    const rId = Number(restaurantId);
    const pId = Number(id);

    // const restaurant = await Restaurant.findByPk(rId);
    // if (!restaurant) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'Restaurant not found'
    //   });
    // }

    const product = await Product.findOne({
      where: {id: pId, restaurantId: rId}
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.destroy();

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

