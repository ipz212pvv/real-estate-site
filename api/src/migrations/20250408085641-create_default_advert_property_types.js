'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('advert_property_type', [
      {
        name: 'Квартира',
        description: 'Оголошення про оренду або купівлю квартир',
      },
      {
        name: 'Будинок',
        description: 'Оголошення про оренду або купівлю будинків',
      },
      {
        name: 'Земельна ділянка',
        description: 'Оголошення про оренду або купівлю земельних ділянок',
      },
      {
        name: 'Гараж',
        description: 'Оголошення про оренду або купівлю гаражів',
      },
      {
        name: 'Комерційна нерухомість',
        description: 'Оголошення про оренду або купівлю комерційної нерухомості',
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('advert_property_type', {
      name: {
        [Sequelize.Op.in]: ['Квартира', 'Будинок', 'Земельна ділянка', 'Гараж', 'Комерційна нерухомість'],
      },
    });
  },
};
