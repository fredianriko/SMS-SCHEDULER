const { validateNewScheduleInput } = require("../validation");

describe("validateNewScheduleInput", () => {
  it("should return an error message if schedules is not an array or is empty", async () => {
    const emptySchedules = [];
    const undefinedSchedules = undefined;
    const nullSchedules = null;

    const result1 = await validateNewScheduleInput(emptySchedules);
    const result2 = await validateNewScheduleInput(undefinedSchedules);
    const result3 = await validateNewScheduleInput(nullSchedules);

    expect(result1).toBe("Schedule must be array type and have minimum 1 object data");
    expect(result2).toBe("Schedule must be array type and have minimum 1 object data");
    expect(result3).toBe("Schedule must be array type and have minimum 1 object data");
  });
  it("should return undefined if the schedules pass all validations", async () => {
    const schedules = [
      {
        phoneNumber: "1234567890",
        delivery_time: "2207131200",
        message: "Hello",
      },
    ];

    const result = await validateNewScheduleInput(schedules);

    expect(result).toBeUndefined();
  });
});
