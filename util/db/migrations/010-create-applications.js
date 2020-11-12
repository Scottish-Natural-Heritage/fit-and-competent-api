'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Applications', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      convictions: {
        type: Sequelize.BOOLEAN
      },
      bestPractice: {
        type: Sequelize.BOOLEAN
      },
      certificateNumber: {
        type: Sequelize.STRING
      },
      certificateIssuedDate: {
        type: Sequelize.DATE
      },
      qualificationHeld: {
        type: Sequelize.STRING
      },
      qualificationReference: {
        type: Sequelize.STRING
      },
      qualificationObtainedDate: {
        type: Sequelize.DATE
      },
      redExperience: {
        type: Sequelize.INTEGER
      },
      redControl: {
        type: Sequelize.INTEGER
      },
      roeExperience: {
        type: Sequelize.INTEGER
      },
      roeControl: {
        type: Sequelize.INTEGER
      },
      sikaExperience: {
        type: Sequelize.INTEGER
      },
      sikaControl: {
        type: Sequelize.INTEGER
      },
      fallowExperience: {
        type: Sequelize.INTEGER
      },
      fallowControl: {
        type: Sequelize.INTEGER
      },
      fullName: {
        type: Sequelize.STRING
      },
      addressLine1: {
        type: Sequelize.STRING
      },
      addressLine2: {
        type: Sequelize.STRING
      },
      addressTown: {
        type: Sequelize.STRING
      },
      addressCounty: {
        type: Sequelize.STRING
      },
      addressPostcode: {
        type: Sequelize.STRING
      },
      phoneNumber: {
        type: Sequelize.STRING
      },
      emailAddress: {
        type: Sequelize.STRING
      },
      refereeName: {
        type: Sequelize.STRING
      },
      refereeEmail: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('Applications');
  }
};
