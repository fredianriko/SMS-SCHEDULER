const { Op } = require("sequelize");
const { scheduled_messages: ScheduleModel } = require("../models");
const { formatDateTimeToNomal } = require("./dateService");

const createBulkScheduleService = async (schedule) => {
  const recordsWithScheduled = schedule.map((record) => ({ ...record, scheduled: true }));
  return await ScheduleModel.bulkCreate(recordsWithScheduled);
};

const sendSMS = async (data, url) => {
  try {
    //resend message to get new message id
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dnis: data.phoneNumber,
        message: data.message,
      }),
    })
      .then((response) => response.json())
      .catch((err) => err.json());

    const getDataToUpdate = await ScheduleModel.findOne({
      where: {
        phoneNumber: data.phoneNumber,
      },
    });
    const dataToUpdate = getDataToUpdate.dataValues;

    // update message id for given schedule with phoneNumber
    const updateNewMessageId = await ScheduleModel.update(
      { messageId: response.message_id },
      {
        where: {
          phoneNumber: dataToUpdate.phoneNumber,
          delivery_status: {
            [Op.ne]: "DELIVRD",
          },
        },
      }
    );
    console.log("Success update new messageId", updateNewMessageId);

    //check status and set to respective messageId
    const checkStatus = await fetch(`http://kr8tif.lawaapp.com:1338/api?messageId=${response.message_id}`)
      .then((response) => response.json())
      .catch((err) => err);

    const updateNewStatus = await ScheduleModel.update(
      {
        delivery_status: checkStatus.status,
        delivery_time: checkStatus.delivery_time,
      },
      {
        where: {
          phoneNumber: dataToUpdate.phoneNumber,
          delivery_status: {
            [Op.ne]: "DELIVRD",
          },
        },
      }
    );

    return updateNewStatus;
  } catch (error) {
    console.error("Failed to send SMS:", error);
    throw error;
  }
};

const getListSchedule = async (parameter) => {
  const limit = parseInt(parameter.limit);
  const dateStart = parameter.dateStart;
  const dateEnd = parameter.dateEnd;

  //query to get list schedule that being scheduled to send between dateStart and dateEnd

  //id, phoneNumber, message,delivery_time
  const getSMSList = await ScheduleModel.findAll({
    where: {
      delivery_time: {
        [Op.between]: [dateStart, dateEnd],
      },
    },
    order: [["delivery_time", "ASC"]],
    limit: limit,
  });
  const mappedSMS = getSMSList.map((item) => item.dataValues);

  return mappedSMS;
};

const getListSMS = async (parameter) => {
  const limit = parseInt(parameter.limit);
  const dateStart = parameter.dateStart;
  const dateEnd = parameter.dateEnd;

  //query to get list schedule that being scheduled to send between dateStart and dateEnd

  //id, phoneNumber, message,delivery_time
  const getScheduleList = await ScheduleModel.findAll({
    attributes: ["id", "phoneNumber", "message", "delivery_time"],
    where: {
      delivery_time: {
        [Op.between]: [dateStart, dateEnd],
      },
    },
    order: [["delivery_time", "ASC"]],
    limit: limit,
  });
  const mappedSchedule = getScheduleList.map((item) => item.dataValues);

  return mappedSchedule;
};

module.exports = { createBulkScheduleService, sendSMS, getListSchedule, getListSMS };
