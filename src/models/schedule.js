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
      message: {
        type: DataTypes.STRING,
      },
      delivery_status: {
        type: DataTypes.STRING,
      },
      scheduled: {
        type: DataTypes.BOOLEAN,
      },
      delivery_time: {
        type: DataTypes.STRING,
      },
      delivered: {
        type: DataTypes.BOOLEAN
      }
    },
    {
      freezeTableName: true,
      timestamps: true,
      paranoid: false,
    }
  );

  return ScheduleModel;
};
