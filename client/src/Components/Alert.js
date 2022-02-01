import { NotificationManager } from "react-notifications";

export const CreateNotification = (message) => {
  if (message.successful) {
    return NotificationManager.success(message.message, "Успіх", 3000);
  } else return NotificationManager.error(message.message, "Помилка", 3000);
};
