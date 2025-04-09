const { DataTypes } = require('sequelize');
const argon2 = require('argon2');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Імʼя не може бути порожнім',
      },
      notNull: {
        msg: 'Імʼя обовʼязкове',
      },
    },
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Прізвище не може бути порожнім',
      },
      notNull: {
        msg: 'Прізвище обовʼязкове',
      },
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: {
      msg: 'Користувач з таким номером вже існує'
    },
    validate: {
      is: {
        args: [/^(?:\d{10}|\+\d{12})$/],
        msg: 'Номер телефону має бути у форматі: +380XXXXXXXXX',
      },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Користувач з такою поштою вже існує'
    },
    validate: {
      notEmpty: {
        msg: 'Email не може бути порожнім',
      },
      isEmail: {
        msg: 'Введіть коректний email',
      },
    },
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: {
        args: [['user']],
        msg: 'Роль повинна бути тільки "user"',
      },
      notEmpty: {
        msg: 'Роль не може бути порожньою',
      },
      notNull: {
        msg: 'Роль не може бути порожньою',
      },
    },
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isBlocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'Рейтинг не може бути менше 0',
      },
      max: {
        args: [5],
        msg: 'Рейтинг не може перевищувати 5',
      },
    },
  },
  userTypeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      notEmpty: {
        msg: 'Тип юзера не може бути порожнім',
      }
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'user',
  timestamps: false,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await argon2.hash(user.password);
      }
    },
    beforeUpdate: async (user) => {
      if (user.password) {
        const isHashed = user.password.startsWith('$argon2');
        if (!isHashed) {
          user.password = await argon2.hash(user.password);
        }
      }
    },
  },
});

module.exports = User;
