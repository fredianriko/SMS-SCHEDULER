1. starts record counter cron on server initialization / first run / restart
2. start first cron on server initialization / first runs / restart
3. stop second cron
4. stop third cron

5. record counter cron

   1. count total phone number/record in schedule_message table
   2. store the total count of record

6. first cron: update messageId for each phone number

   1.
   1. get all phone number and set into array of number string : ["123","123"]
   1. set into list of number string: "1023,1234" -> this will be dnis payload
   1. send message to api and get messageId -> [{dnis:"<phoneNumber>", message_id: "<message_id_string>"}]
   1. loop over phoneNumber list
      1. forEach phoneNumber, update messageId with message_id from response
      2. stop this cron when all phone number already have messageId (this is only the case with first time this server runs and with empty messageId for each phone number) / updated with new messageId

7. second cron: update status for all messageId
   1. get all messageId and set into array of messageId: ["messageId_1","messageId_2"]
   2. loop over messageId array,
      1. fetch to api to get each messageId status -> {status: 'DELIVRD',delivery_time:"YYYYMMDDHHmm"}
      2. set each messageId with status from api response
   3. stop cron 2

<!-- -> this must run before the next first cron run -->
<!-- should stop when all schedule status is delivered, and start again when it detect new status from database other than delivered -->

8. third cron: resend new message for all phone number with status other than 'DELIVRD'

   1. current condition first cron and second cron are stopped
   2. get all messageId with status other than 'DELIVRD'
   3. forEach messageId
      1. fetch to api to get status for each messageId -> {status: 'DELIVRD',delivery_time:"YYYYMMDDHHmm"}
      2. update messageId with status from api response
   4. this cron will keeps running untill all schedule status are "DELIVRD"
   5. if all schedule status are "DELIVRD"
      1. stop cron 3
      2. start cron 1
      3. start cron 2
