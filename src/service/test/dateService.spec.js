// Import the necessary modules
const { formatTimeForCron, validateDate, formatDateTimeToNomal } = require("../dateService");

// formatTimeForCron
describe("formatTimeForCron", () => {
  it("should format the time correctly for cron", async () => {
    const date = "2307130001";
    const expectedCronTime = "01 00 13 07 * ";

    const cronTime = await formatTimeForCron(date);

    expect(cronTime).toEqual(expectedCronTime);
  });

  // Add more test cases if needed
});

//validateDate
describe("validateDate", () => {
  it("should return true if both dateStart and dateEnd are valid formats", async () => {
    const dateStart = "2307130001";
    const dateEnd = "2307131800";
    const isValid = await validateDate(dateStart, dateEnd);
    expect(isValid).toBe(true);
  });

  it("should return false if dateStart is not a valid format", async () => {
    const dateStart = "23071300"; // Invalid format (less than 10 digits)
    const dateEnd = "2307131800";
    const isValid = await validateDate(dateStart, dateEnd);
    expect(isValid).toBe(false);
  });

  it("should return false if dateEnd is not a valid format", async () => {
    const dateStart = "2307130001";
    const dateEnd = "23071318"; // Invalid format (less than 10 digits)
    const isValid = await validateDate(dateStart, dateEnd);
    expect(isValid).toBe(false);
  });

  it("should return false if both dateStart and dateEnd are not valid formats", async () => {
    const dateStart = "23071300"; // Invalid format (less than 10 digits)
    const dateEnd = "23071318"; // Invalid format (less than 10 digits)
    const isValid = await validateDate(dateStart, dateEnd);
    expect(isValid).toBe(false);
  });
});

//formatDateTimeToNomal
describe("formatDateTimeToNomal", () => {
  it("should format the input date and time correctly", async () => {
    const input = "2307131800";
    const expectedOutput = "2023-07-13 18:00:00";
    const formattedDateTime = await formatDateTimeToNomal(input);
    expect(formattedDateTime).toBe(expectedOutput);
  });

  it("should handle single-digit values for month, day, hour, and minute", async () => {
    const input = "2307010701";
    const expectedOutput = "2023-07-01 07:01:00";
    const formattedDateTime = await formatDateTimeToNomal(input);
    expect(formattedDateTime).toBe(expectedOutput);
  });
});
