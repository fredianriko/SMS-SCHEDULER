const express = require("express");
const app = express();
const cors = require("cors");
const { recordCounter, getTotalRecord } = require("./service/recordCounter");
const { createBulkScheduleService, getListSchedule } = require("./service/scheduleServices");
const { sendSmsSetMessageId } = require("./cron");
const { sequelize } = require("./models");
const { validateNewScheduleInput } = require("./helper/validation");
const { recheckStatus } = require("./cron/index");
const path = require("path");
const { validateDate } = require("./service/dateService");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
app.use(express.json());
app.use(cors());

// Database Connection
sequelize.authenticate().then(() => {
  console.log("Database Connected");
});

// start cron that runs every minute to update the status until it become 'DELIVRD'
recheckStatus(process.env.URL_SEND);

//api trigger to add new schedule
app.post("/scheduleSMS", async (req, res) => {
  const schedules = req.body.schedule || [];

  try {
    //payload validation
    await validateNewScheduleInput();

    //createBulk schedule
    await createBulkScheduleService(schedules);

    // updateRecord
    await recordCounter();

    //call function that trigger cron to start here
    await sendSmsSetMessageId();

    const setScheduleResult = {
      status: 201,
      message: "Success add schedule and update record counter",
      total_schedule_added: await getTotalRecord(),
    };

    res.status(201).send(setScheduleResult);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

// bonus api
//api to get list schedule
app.get("/getSchedule", async (req, res) => {
  const limit = req.query.limit ? req.query.limit : 10;
  const dateStart = req.query.dateStart || null;
  const dateEnd = req.query.dateEnd || null;

  //validation
  if (!dateStart || !dateEnd) {
    res.status(400).send({
      status: 400,
      message: `dateStart and dateEnd must be provided`,
    });
  }

  if ((await validateDate(dateStart, dateEnd)) == false) {
    res.status(400).send({
      status: 400,
      message: "dateStart and dateEnd must be in YYMMDDHHmm format",
    });
  }

  if (!Number.isInteger(parseInt(limit))) {
    res.status(400).send({
      status: 400,
      message: "limit must be integer type",
    });
  }

  // return list schedule
  const listSchedule = await getListSchedule({ limit, dateStart, dateEnd });

  const result = {
    status: 200,
    message: "Success get list schedule",
    data: listSchedule,
  };

  res.status(200).send(result);
});

//api to get list sms
app.get("/getSMS", async (req, res) => {
  const limit = req.query.limit ? req.query.limit : 10;
  const dateStart = req.query.dateStart || null;
  const dateEnd = req.query.dateEnd || null;

  //validation
  if (!dateStart || !dateEnd) {
    res.status(400).send({
      status: 400,
      message: `dateStart and dateEnd must be provided`,
    });
  }

  if ((await validateDate(dateStart, dateEnd)) == false) {
    res.status(400).send({
      status: 400,
      message: "dateStart and dateEnd must be in YYMMDDHHmm format",
    });
  }

  if (!Number.isInteger(parseInt(limit))) {
    res.status(400).send({
      status: 400,
      message: "limit must be integer type",
    });
  }

  // return list schedule
  const listSMS = await getListSchedule({ limit, dateStart, dateEnd });
  const result = {
    status: 200,
    message: "Success get list SMS",
    data: listSMS,
  };

  res.status(200).send(result);
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

process.on("uncaughtException", (error) => {
  console.log(error);
});

process.on("SIGINT", function () {
  console.log("Shutting down from CTRL+C");
  process.exit();
});

module.exports = app;
