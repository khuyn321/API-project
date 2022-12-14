'use strict';
const { Model, Validator, Op } = require('sequelize')
const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    toSafeObject() {
      const { id, firstName, lastName, email, username } = this; //context will be the User instance
      return { id, firstName, lastName, email, username }
    }
    validatePassword(password) {
      return bcrypt.compareSync(password, this.hashedPassword.toString())
    }
    static getCurrentUserById(id) {
      return User.findByPk(id);
    }
    static async login({ credential, password }) {
      const user = await User.scope('loginUser').findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      })
      if (user && user.validatePassword(password)) {
        return await User.findByPk(user.id)
      }
    }
    static async signup({ username, email, password, firstName, lastName }) {
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({
        username,
        email,
        hashedPassword,
        firstName,
        lastName
      });
      return await User.findByPk(user.id);
    }
    static associate(models) {
      // define association here
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4, 30],
        isNotEmail(value) {
          if (Validator.isEmail(value)) throw new Error('Cannot be an email.')
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 256],
        isEmail: true
      }
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      validate: {
        len: [60, 60]
      }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        max: 30
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        max: 30
      }
    },
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {  //* USES USERNAME & ID
      attributes: {
        exclude: ["hashedPassword", "createdAt", "updatedAt"]
      }
    },
    scopes: {
      currentUser: {  //* USES EVERYTHING EXCEPT HASHED PASSWORD
        attributes: {
          exclude: ['hashedPassword']
        }
      },
      loginUser: {  //* USES ALL STORED TABLE INFO
        attributes: {}
      }
    }
  });
  return User;
};