const validateNewScheduleInput = async (schedules) => {
  if (schedules == undefined || schedules.length < 1 || schedules == null) {
    return "Schedule must be array type and have minimum 1 object data"
  }

  const errorMessage = [];

  schedules.forEach((schedule) => {
    // Validate phoneNumber type
    if (typeof schedule.phoneNumber !== "string") {
      errorMessage.push("phoneNumber must be a string");
    }

    // Validate delivery_time format (YYMMDDHHmm)
    const deliveryTimeRegex = /^\d{10}$/; // Regular expression to match YYMMDDHHmm format
    if (!deliveryTimeRegex.test(schedule.delivery_time)) {
      errorMessage.push("delivery_time must be in YYMMDDHHmm format");
    }

    // Validate message
    if (typeof schedule.message !== "string" || schedule.message.trim().length === 0) {
      errorMessage.push("message must be a valid non-empty string");
    }
  });

  if (errorMessage.length > 0) {
    const errorPayload = {
      status: 400,
      message: "Validation error",
      errors: errorMessage,
    };
    return errorPayload;
  }
};

module.exports = { validateNewScheduleInput };
