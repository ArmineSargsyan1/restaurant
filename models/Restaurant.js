import {DataTypes, Model, Sequelize} from 'sequelize';
import sequelize from '../clients/db.sequelize.mysql.js';

class Restaurant extends Model {

  static createRestaurant(data) {
    return this.create(data);
  }

  static getAll({page, limit, cuisine_type, price_range}) {
    const offset = (page - 1) * limit;

    const where = {};
    if (cuisine_type) {
      where.cuisine_type = cuisine_type
    };
    if (price_range) {
      where.price_range = price_range
    };

    return this.findAndCountAll({
      where,
      limit,
      offset
    });
  }

  static getById(id) {
    return this.findByPk(id);
  }

  static async updateById(id, data) {
    const restaurant = await this.findByPk(id);
    if (!restaurant) return null;

    return restaurant.update(data);
  }


  static async deleteById(id) {
    const restaurant = await this.findByPk(id);
    if (!restaurant) return null;

    await restaurant.destroy();
    return true;
  }


  static async findNearby({latitude, longitude, radius, page = 1, limit = 10, cuisine_type, min_rating, unit = 'km'}) {
    const lat = Number(latitude);
    const lng = Number(longitude);
    const maxDistance = Number(radius);
    const rowLimit = Number(limit);
    const currentPage = Number(page);
    const offset = (currentPage - 1) * rowLimit;

    const R = unit === 'miles' ? 3959 : 6371;

    const where = {is_open: true};
    if (cuisine_type) where.cuisine_type = cuisine_type;
    if (min_rating) where.rating = {[Sequelize.Op.gte]: Number(min_rating)};

    const distanceLiteral = Sequelize.literal(`
    ${R} * acos(
      cos(radians(${lat})) * cos(radians(latitude)) *
      cos(radians(longitude) - radians(${lng})) +
      sin(radians(${lat})) * sin(radians(latitude))
    )
  `);

    return this.findAll({
      attributes: {
        include: [[distanceLiteral, 'distance']]
      },
      where,
      having: Sequelize.literal(`distance <= ${maxDistance}`),
      order: Sequelize.literal('distance ASC'),
      limit: rowLimit,
      offset
    });
  }

}

Restaurant.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: DataTypes.STRING,
    cuisine_type: DataTypes.STRING,
    price_range: DataTypes.STRING,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    is_open: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    sequelize,
    modelName: 'restaurant',
    tableName: 'restaurants',
    timestamps: true
  }
);

export default Restaurant;
