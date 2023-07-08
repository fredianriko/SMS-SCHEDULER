const express = require("express");
const app = express();
const cron = require("node-cron");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());
app.use(cors());

// Create cron job to send sms
const sendSms = cron.schedule(
  "*/2 * * * * *",
  () => {
    console.log("Scheduler");
  },
  {
    scheduled: true,
    timezone: "Asia",
  }
);

// sendSms.start();

// make api to trigger the scheduler

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
