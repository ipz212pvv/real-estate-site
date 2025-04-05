'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('user_type', [
      {
        name: 'Продавець',
        description: 'Особа, яка продає нерухомість',
      },
      {
        name: 'Рієлтор',
        description: 'Спеціаліст, який займається купівлею та продажем нерухомості',
      },
      {
        name: 'Забудовник',
        description: 'Особа або компанія, яка займається будівництвом нових обʼєктів нерухомості',
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('user_type', {
      name: {
        [Sequelize.Op.in]: ['Продавець', 'Рієлтор', 'Забудовник'],
      },
    });
  },
};

