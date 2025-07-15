import cron from "node-cron";
import messages from "../models/messages.js";

//clean messages older than specified timeline
const MessageRententionDays = 30;

export const startMessageCleanupJob = () => {
  //schedule to run daily at 2.00am
  cron.schedule("0 2 * * *", async () => {
    try {
      const cutOffDate = new Date();
      cutOffDate.setDate(cutOffDate.getDate() - MessageRententionDays);

      //find message hidden or deleted before cut off date
      const olderMessages = await messages.find({
        hiddenFromUser: true,
        createdAt: { $lt: cutOffDate },
      });

      if (olderMessages.length > 0) {
        const deleteResult = await messages.deleteMany({
          hiddenFromUser: true,
          createdAt: { $lt: cutOffDate },
        });

        console.log(
          `CRON deleted ${deleteResult.deletedCount} old hidden messages`
        );
      } else {
        console.log(`CRON: no hidden messages to delete`);
      }
    } catch (error) {
      console.log("Cron error cleaning old messages", error);
    }
  });
};
