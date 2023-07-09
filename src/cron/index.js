const cron = require("node-cron");
const { schedule_message: ScheduleModel } = require("../models");

// run once a day at 12 AM
// const counterCron = cron.schedule("*/5 * * * *", () => {});

// testing 5 second
// run every 5 minute,
//triggered on initial server run , restart and by updateStatusToDelivrd cron
// const sendSmsSetMessageId = cron.schedule("*/5 * * * * *", async () => {
//   const messageSend = "Hellow";

//   // solution for data scalling
//   // Number of phone numbers to process in each batch
//   const batchSize = 2;
//   const recordCounter = await RecordCounter.findByPk(1);
//   const totalRecord = recordCounter.total_record;
//   let offset = 0;

//   while (offset <= totalRecord) {
//     // get all number only where status null or delivered
//     const getSchedule = await ScheduleModel.findAll({
//       attributes: ["phoneNumber"],
//       offset,
//       limit: batchSize,
//     });

//     const phonesString = getSchedule
//       .map((result) => result.dataValues)
//       .map((obj) => obj.phoneNumber)
//       .join(",");

//     // send message to http://kr8tif.lawaapp.com:1338/api for every number
//     const sendSms = await fetch("http://kr8tif.lawaapp.com:1338/api", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         dnis: phonesString,
//         message: messageSend,
//       }),
//     })
//       .then((response) => {
//         const raw = response.json();
//         return raw;
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });

//     //update messageId field where phoneNumber is current phoneNumber
//     for (let i = 0; i < sendSms.length; i++) {
//       const item = sendSms[i];
//       await ScheduleModel.update({ messageId: item.message_id }, { where: { phoneNumber: item.dnis } });
//     }

//     // increase the offset here
//     offset += batchSize;
//   }

//   // start second cron
//   res.send("messageId updated");
// });

// run when triggered by first cron,
//and runs every 5 minute,
//stops when all phone number have messageId
const setMessageId = cron.schedule();

// run when triggered by second cron,
// runs every 5 minute,
// stops when all status are 'DELIVRD',
// triggered firstCron to run
const updateStatusToDelivrd = cron.schedule();

module.exports = { counterCron, sendSmsSetMessageId, setMessageId, updateStatusToDelivrd };
