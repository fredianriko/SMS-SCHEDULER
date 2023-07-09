const express = require("express");
const app = express();
const cron = require("node-cron");
const cors = require("cors");
const dotenv = require("dotenv");
const { scheduled_messages: ScheduleModel, record_counter: RecordCounter, sequelize, Sequelize } = require("./models");
const { Op } = require("sequelize");
dotenv.config();

app.use(express.json());
app.use(cors());

sequelize.authenticate().then(() => {
  console.log("Database Connected");
});

// create cron that will run once a day to count total phone number exist
// this count number will be usefull for pagination purposes
// where this number will be passed to first cron, for getting only chunks of phone number and update it on scale
// let say there are 900 phone number
// divide this number by 100 -> this will be the amount of data used each time the cron runs
// pass the how many page will it be, it be 9
// then just passed this numbers to the first cron such as this

// {
//   totalRecord: 900
//   totalPage: 9,
//
// }

// the first cron will just need to iterate over the total page
// use the record page as limit
// let say now the second iteration -> 2
// multiply by

//start record counter cron
// start first cron
// stop second cron
// stop third cron

// this cron will run once a day
app.get("/recordCounter", async (req, res) => {
  try {
    // count all record
    //something must be wrong here, this should return 10, but it only count 9, also if i add 1 more data, it counts only -1 than the actual data count
    const countAllRecord = await ScheduleModel.count();

    const updateTotalRecord = await RecordCounter.update({ total_record: countAllRecord }, { where: { id: 1 } });

    const result = {
      status: updateTotalRecord === 1 ? 201 : 200,
      totalRecords: countAllRecord,
      update_status: updateTotalRecord,
    };
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.post("/sendSMS", async (req, res) => {
  const messageSend = "Hellow";

  // solution for data scalling
  // Number of phone numbers to process in each batch
  const batchSize = 2;
  const recordCounter = await RecordCounter.findByPk(1);
  const totalRecord = recordCounter.total_record;
  let offset = 0;

  while (offset <= totalRecord) {
    // get all number only where status null or delivered
    const getSchedule = await ScheduleModel.findAll({
      attributes: ["phoneNumber"],
      offset,
      limit: batchSize,
    });

    const phonesString = getSchedule
      .map((result) => result.dataValues)
      .map((obj) => obj.phoneNumber)
      .join(",");

    // send message to http://kr8tif.lawaapp.com:1338/api for every number
    const sendSms = await fetch("http://kr8tif.lawaapp.com:1338/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dnis: phonesString,
        message: messageSend,
      }),
    })
      .then((response) => {
        const raw = response.json();
        return raw;
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    //update messageId field where phoneNumber is current phoneNumber
    for (let i = 0; i < sendSms.length; i++) {
      const item = sendSms[i];
      await ScheduleModel.update({ messageId: item.message_id }, { where: { phoneNumber: item.dnis } });
    }
    offset += batchSize;
  }

  // start second cron
  res.send("messageId updated");
});

app.post("/setStatus", async (req, res) => {
  // get all messageId and status
  const getSchedule = await ScheduleModel.findAll({
    attributes: ["phoneNumber", "messageId", "status"],
  });

  // get All messageID list
  const listMessageId = getSchedule.map((item) => item.dataValues).map((item) => item.messageId);

  //check status for each messageId to http://kr8tif.lawaapp.com:1338/api with GET method request
  const statusResponse = await Promise.all(
    listMessageId.map(async (item) => {
      const checkStatusMessage = await fetch(`http://kr8tif.lawaapp.com:1338/api?messageId=${item}`).then((response) => response.json());

      // update status for each messageId here, item here is messageId
      const updateStatus = await ScheduleModel.update({ status: checkStatusMessage.status }, { where: { messageId: item } });
      console.log("Updating status", updateStatus);
      return checkStatusMessage;
    })
  );

  // stop cron after this operation
  // start cron 3

  res.send(statusResponse);
});

app.post("/updateToDelivrd", async (req, res) => {
  const getSchedule = await ScheduleModel.findAll({
    attributes: ["messageId", "status"],
    where: {
      status: {
        [Op.not]: "DELIVRD",
      },
    },
  });

  const messageIdArray = getSchedule.map((item) => item.dataValues);

  if (messageIdArray.length < 1) return;

  // loop each messageId array to get status of each messageId, and update it to database
  messageIdArray.forEach(async (item) => {
    // get status for item
    const status = await fetch(`http://kr8tif.lawaapp.com:1338/api?messageId=${item.messageIds}`).then((response) => response.json());

    const updatingStatus = await ScheduleModel.update({ status: status.status }, { where: { messageId: item.messageId } });
    console.log(updatingStatus);
  });

  // check all status from database
  // if there are still status other than 'DELIVRD', let this cron keeps running

  //if all of status already "DELIVRD",
  //start cron 1
  //start cron 2
  //stop this cron
});

// POC: Proof of Concept

const firstCron = cron.schedule("*/5 * * * * *", async function () {
  for (let i = 0; i < 5; i++) {
    console.log(`First Cron ${i}`);
  }
  this.stop();
});

const secondCron = cron.schedule("*/5 * * * * *", async function () {
  for (let i = 0; i < 5; i++) {
    console.log(`Second Cron ${i}`);
  }
  this.stop();
});

const thirdCron = cron.schedule("*/5 * * * * *", async function () {
  for (let i = 0; i < 5; i++) {
    console.log(`Third Cron ${i}`);
  }

  this.stop();
  firstCron.start();
});

firstCron.start();
secondCron.start();
thirdCron.start();

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
