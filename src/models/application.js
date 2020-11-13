'use strict';

// eslint-disable-next-line unicorn/prevent-abbreviations
const ApplicationModel = (sequelize, DataTypes) => {
  // eslint-disable-next-line unicorn/prevent-abbreviations
  const Application = sequelize.define(
    'Application',
    {
      convictions: {
        type: DataTypes.BOOLEAN
      },
      bestPractice: {
        type: DataTypes.BOOLEAN
      },
      certificateNumber: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true
        }
      },
      certificateIssuedDate: {
        type: DataTypes.DATE,
        validate: {
          notEmpty: true
        }
      },
      qualificationHeld: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true
        }
      },
      qualificationReference: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true
        }
      },
      qualificationObtainedDate: {
        type: DataTypes.DATE,
        validate: {
          notEmpty: true
        }
      },
      redExperience: {
        type: DataTypes.INTEGER
      },
      redControl: {
        type: DataTypes.INTEGER
      },
      roeExperience: {
        type: DataTypes.INTEGER
      },
      roeControl: {
        type: DataTypes.INTEGER
      },
      sikaExperience: {
        type: DataTypes.INTEGER
      },
      sikaControl: {
        type: DataTypes.INTEGER
      },
      fallowExperience: {
        type: DataTypes.INTEGER
      },
      fallowControl: {
        type: DataTypes.INTEGER
      },
      fullName: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true
        }
      },
      addressLine1: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true
        }
      },
      addressLine2: {
        type: DataTypes.STRING
      },
      addressTown: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true
        }
      },
      addressCounty: {
        type: DataTypes.STRING
      },
      addressPostcode: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true
        }
      },
      phoneNumber: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true
        }
      },
      emailAddress: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
          isEmail: true
        }
      }
    },
    {
      timestamps: true,
      paranoid: true
    }
  );
  return Application;
};

export {ApplicationModel as default};
