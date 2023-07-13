const { Op } = require("sequelize");
const { record_counter: RecordCounter, scheduled_messages: ScheduleModel } = require("../models");

//updating record counter
const recordCounter = async () => {
  try {
    const recordCounted = await ScheduleModel.count({
      where: {
        [Op.or]: [{ delivery_status: { [Op.eq]: null } }, { delivery_status: { [Op.eq]: "" } }, { delivery_status: { [Op.ne]: "DELIVRD" } }],
      },
    });

    const updateRecord = await RecordCounter.update({ total_record: recordCounted }, { where: { id: 1 } });

    if (updateRecord[0] === 1) {
      const recordCounter = "record counter updated";
      return recordCounter;
    } else {
      console.log("record counter still the same as last time");
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

const getTotalRecord = async () => {
  const totalRecord = await RecordCounter.findByPk(1);
  return totalRecord.dataValues.total_record;
};

module.exports = { recordCounter, getTotalRecord };
