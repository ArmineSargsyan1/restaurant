import Joi from "joi";


export default {

  createRestaurant: {
    body: Joi.object({
      name: Joi.string().min(3).required(),
      description: Joi.string().optional(),
      cuisine_type: Joi.string().optional(),
      address: Joi.string().required(),
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required(),
      rating: Joi.number().min(0).max(5).optional(),
      price_range: Joi.string().valid('$', '$$', '$$$', '$$$$').optional(),
      phone: Joi.string().optional(),
      is_open: Joi.boolean().optional()

    })
  },


  getAllRestaurants: {
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
      cuisine_type: Joi.string().optional(),
      price_range: Joi.string().optional()

    })
  },


  findNearbyRestaurants: {
    query: Joi.object({
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required(),
      radius: Joi.number().max(50).default(5),
      limit: Joi.number().max(100).default(10),
      cuisine_type: Joi.string().optional(),
      min_rating: Joi.number().min(0).max(5).optional(),
      page: Joi.number().integer().min(1).default(1),
      unit: Joi.string().valid('km', 'miles').default('km')
    })
  },


}


