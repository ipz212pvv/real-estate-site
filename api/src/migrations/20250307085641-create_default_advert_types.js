'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('advert_type', [
      {
        name: 'Оренда',
        description: 'Оголошення про оренду нерухомості або інших обʼєктів',
      },
      {
        name: 'Продаж',
        description: 'Оголошення про продаж нерухомості або інших обʼєктів',
      },
      {
        name: 'Новобудова',
        description: 'Оголошення для оренди або інших пропозицій на короткий термін (один день)',
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('advert_type', {
      name: {
        [Sequelize.Op.in]: ['Оренда', 'Продаж', 'Новобудова'],
      },
    });
  },
};
