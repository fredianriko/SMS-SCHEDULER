"use strict";
module.exports = (sequelize, DataTypes) => {
  const ScheduleLogModel = sequelize.define(
    "scheduled_log",
    {
      sender: {
        type: DataTypes.STRING,
      },
      recipient: {
        type: DataTypes.STRING,
      },
      messageId: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.STRING,
      },
      sendTime: {
        type: DataTypes.DATE,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
      paranoid: false,
    }
  );

  return ScheduleLogModel;
};
