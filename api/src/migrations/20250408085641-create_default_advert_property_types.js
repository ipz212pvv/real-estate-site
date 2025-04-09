'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('advert_property_type', [
      {
        name: 'квартира',
        description: 'Оголошення про оренду або купівлю квартир',
      },
      {
        name: 'дім',
        description: 'Оголошення про оренду або купівлю будинків',
      },
      {
        name: 'земна ділянка',
        description: 'Оголошення про оренду або купівлю земельних ділянок',
      },
      {
        name: 'гараж',
        description: 'Оголошення про оренду або купівлю гаражів',
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('advert_property_type', {
      name: {
        [Sequelize.Op.in]: ['квартира', 'дім', 'земна ділянка', 'гараж'],
      },
    });
  },
};
