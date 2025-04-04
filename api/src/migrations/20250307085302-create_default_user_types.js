'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('user_type', [
      {
        name: 'рієлтор',
        description: 'Спеціаліст, який займається купівлею та продажем нерухомості',
      },
      {
        name: 'забудовник',
        description: 'Особа або компанія, яка займається будівництвом нових обʼєктів нерухомості',
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('user_type', {
      name: {
        [Sequelize.Op.in]: ['рієлтор', 'забудовник'],
      },
    });
  },
};

