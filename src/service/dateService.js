const formatTime = async (date) => {
  const month = date.substr(2, 2);
  const day = date.substr(4, 2);
  const hour = date.substr(6, 2);
  const minute = date.substr(8, 2);
  const cronTime = `${minute} ${hour} ${day} ${month} * `;
  return cronTime;
};

module.exports = { formatTime };
