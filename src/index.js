const express = require("express");
const app = express();
const cors = require("cors");

const { recordCounter, getTotalRecord } = require("./service/recordCounter");
const { createBulkScheduleService } = require("./service/scheduleServices");
const { sendSmsSetMessageId } = require("./cron");
const { sequelize } = require("./models");
const { validateNewScheduleInput } = require("./helper/validation");
const { recheckStatus } = require("./cron/index");
const path = require("path");
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

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
