"use strict";
module.exports = (sequelize, DataTypes) => {
  const ScheduleModel = sequelize.define(
    "scheduled_messages",
    {
      phoneNumber: {
        type: DataTypes.STRING,
      },
      messageId: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.STRING,
      },
      message: {
        type: DataTypes.STRING,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
      paranoid: false,
    }
  );

  return ScheduleModel;
};
