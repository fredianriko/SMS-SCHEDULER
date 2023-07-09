"use strict";
module.exports = (sequelize, DataTypes) => {
  const RecordCounter = sequelize.define(
    "record_counter",
    {
      total_record: {
        type: DataTypes.STRING,
      },
      page_limit: {
        type: DataTypes.STRING,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
      paranoid: false,
    }
  );

  return RecordCounter;
};
