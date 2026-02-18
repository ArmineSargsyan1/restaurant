import {DataTypes, Model, Sequelize} from 'sequelize';
import sequelize from '../clients/db.sequelize.mysql.js';

class Restaurant extends Model {

  static setLocationFields(data) {
    if (data.latitude != null && data.longitude != null) {
      data.location = {
        type: 'Point',
        coordinates: [
          Number(data.longitude),
          Number(data.latitude)
        ]
      };
    }
  }


  static async findNearby({latitude, longitude, radius, page = 1, limit = 10, cuisineType, minRating, unit = 'km'}) {

    const lat = Number(latitude);
    const lon = Number(longitude);
    const maxDistance = Number(radius);
    const offset = (page - 1) * limit;

    const where = {isOpen: true};

    if (cuisineType) {
      where.cuisineType = cuisineType;
    }

    if (minRating) {
      where.rating = {[Sequelize.Op.gte]: Number(minRating)};
    }

    const distanceLiteral = Sequelize.fn(
      'ST_Distance_Sphere',
      Sequelize.fn('POINT', Sequelize.col('longitude'), Sequelize.col('latitude')),
      Sequelize.fn('POINT', lon, lat)
    );

    return this.findAll({
      attributes: {
        include: [[distanceLiteral, 'distance']]
      },
      where: {
        ...where,
        [Sequelize.Op.and]: [
          Sequelize.where(distanceLiteral, '<=', maxDistance)
        ]
      },
      order: [[distanceLiteral, 'ASC']],
      limit: Number(limit),
      offset: Number(offset)
    });
  }

}

Restaurant.init(
  {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING(255), allowNull: false, validate: {len: [3, 255]}},
    description: {type: DataTypes.TEXT},
    cuisineType: {type: DataTypes.STRING(100)},
    address: {type: DataTypes.STRING(255), allowNull: false},
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
      validate: {min: -90, max: 90}
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
      validate: {min: -180, max: 180}
    },
    location: {type: DataTypes.GEOMETRY('POINT', 4326), allowNull: false},
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      defaultValue: 0,
      validate: {min: 0, max: 5}
    },
    priceRange: {
      type: DataTypes.ENUM('$', '$$', '$$$', '$$$$'),
      defaultValue: '$$'
    },
    phone: {type: DataTypes.STRING(20)},
    isOpen: {type: DataTypes.BOOLEAN, defaultValue: true},

    coverImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: null
    },

  },
  {
    sequelize,
    modelName: 'Restaurant',
    tableName: 'restaurants',
    underscored: true,
    timestamps: true,
    hooks: {
      beforeValidate: (restaurant) => {
        if (
          restaurant.latitude != null &&
          restaurant.longitude != null
        ) {
          restaurant.location = {
            type: 'Point',
            coordinates: [
              Number(restaurant.longitude),
              Number(restaurant.latitude)
            ]
          };
        }
      }
    }

  }
);


export const associateRestaurant = (models) => {
  Restaurant.hasMany(models.Product, {
    foreignKey: 'restaurantId',
    as: 'products'
  });
};

export default Restaurant;




