const checkMessageStatus = async (client, messageSid) => {
  if (!messageSid || messageSid == "") return "message sid cannot be empty";
  try {
    const message = await client.messages("SM9e8268e89b51650d91d4de2a52251303").fetch();
    const log = {
      messageSid: message.id,
      status: message.status,
      dateSent: message.dateSent,
      dateUpdated: message.dateUpdated,
      recipient: message.to,
      sender: message.from,
    };
    return log;
  } catch (error) {
    console.error("Error retrieving message details:", error);
  }
};
