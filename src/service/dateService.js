const formatTimeForCron = async (date) => {
  const month = date.substr(2, 2);
  const day = date.substr(4, 2);
  const hour = date.substr(6, 2);
  const minute = date.substr(8, 2);
  const cronTime = `${minute} ${hour} ${day} ${month} * `;
  return cronTime;
};

const validateDate = async (dateStart, dateEnd) => {
  const isValidStartFormat = /^\d{10}$/.test(dateStart);
  const isValidEndFormat = /^\d{10}$/.test(dateEnd);
  if (!isValidStartFormat || !isValidEndFormat) return false;
  return true;
};

const formatDateTimeToNomal = async (input) => {
  const year = "20" + input.substr(0, 2);
  const month = input.substr(2, 2);
  const day = input.substr(4, 2);
  const hour = input.substr(6, 2);
  const minute = input.substr(8, 2);

  const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:00`;
  return formattedDate;
};

module.exports = { formatTimeForCron, validateDate, formatDateTimeToNomal };
