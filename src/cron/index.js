const cron = require("node-cron");
const { scheduled_messages: ScheduleModel, record_counter: RecordCounter } = require("../models");
const { Op } = require("sequelize");
const { formatTimeForCron } = require("../service/dateService");
const { sendSMS } = require("../service/scheduleServices");

//called on api trigger
const sendSmsSetMessageId = async () => {
  const getTotal = await RecordCounter.findByPk(1);
  let offset = 0;
  let limit = 3; // can be change depends on demand
  const totalPage = getTotal.dataValues.total_record;

  // batch operation
  while (offset <= totalPage) {
    //get data with limit
    const getLimitedData = await ScheduleModel.findAll({
      where: {
        messageId: {
          [Op.or]: ["", null],
        },
        delivery_status: null,
      },
      limit: limit,
      offset: offset,
    });
    const dataOnly = getLimitedData.map((item) => item.dataValues);

    //fetch post request to http://kr8tif.lawaapp.com:1338/ and get messageId for each phone
    dataOnly.forEach(async (data) => {
      const cronTime = await formatTimeForCron(data.delivery_time);

      //create cron that scheduling each data from getLimitedData
      const sendSmsUpdateMessageId = cron.schedule(cronTime, async () => {
        try {
          // send sms based on schedule
          const sendSms = await fetch("http://kr8tif.lawaapp.com:1338/api", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              dnis: data.phoneNumber.toString(),
              message: data.message,
            }),
          });

          const messageIdReturned = await sendSms.json();

          //initial set messageId
          const setMessageId = await ScheduleModel.update(
            {
              messageId: messageIdReturned.message_id,
              scheduled: 1,
            },
            {
              where: {
                phoneNumber: data.phoneNumber,
                messageId: { [Op.or]: ["", null] },
              },
            }
          );
          console.log("Success set initial messageId", setMessageId);

          // get data again where delivery_status empty or null
          const getDataDeliveryStatus = await ScheduleModel.findAll({
            where: {
              delivery_status: {
                [Op.or]: ["", null],
              },
            },
          });

          // Set initial delivery status from messageId
          const undeliverdData = getDataDeliveryStatus.map((item) => item.dataValues);
          for (const data of undeliverdData) {
            try {
              const checkStatus = await fetch(`http://kr8tif.lawaapp.com:1338/api?messageId=${data.messageId}`)
                .then((response) => response.json())
                .catch((err) => err);

              await ScheduleModel.update(
                {
                  delivery_status: checkStatus.status,
                  delivery_time: checkStatus.delivery_time,
                  delivered: 1,
                },
                {
                  where: {
                    delivery_status: {
                      [Op.or]: ["", null],
                    },
                    messageId: data.messageId,
                  },
                }
              );

              console.log("Update completed for messageId:", data.messageId);
            } catch (error) {
              console.error("Error updating for messageId:", data.messageId, error);
            }
          }
        } catch (error) {
          console.error("Error setting initial messageId for phoneNumber:", data.phoneNumber, error);
        }
      });

      // start the cron
      sendSmsUpdateMessageId.start();
      console.log("Success: Set Schedule for phoneNumber:", data.phoneNumber);
    });

    offset += limit;
  }
  return 1;
};

const recheckStatus = (url) => {
  const recheckStatusCron = cron.schedule("* * * * *", async () => {
    // checking status on batch size
    const getTotal = await ScheduleModel.count({
      where: {
        delivery_status: {
          [Op.ne]: "DELIVRD",
        },
      },
    });
    let limit = 3; // can be change depends on demand

    while (getTotal != 0) {
      try {
        // Get all data where delivery_status is not 'DELIVRD'
        const getSchedule = await ScheduleModel.findAll({
          where: {
            delivery_status: {
              [Op.not]: "DELIVRD",
            },
            messageId: {
              [Op.not]: "",
              [Op.not]: null,
            },
          },
          limit: limit,
        });

        const dataShedule = getSchedule.map((item) => item.dataValues);

        // loop over != DELIVRD data, resend sms and set new status
        let response;
        for (const scheduledMessage of dataShedule) {
          response = await sendSMS(scheduledMessage, url);
        }

        console.log("Success update message to DELIVRD", response);
      } catch (error) {
        console.error("Failed to fetch scheduled messages:", error);
      }
    }
  });
  recheckStatusCron.start();
};

module.exports = { sendSmsSetMessageId, recheckStatus };
