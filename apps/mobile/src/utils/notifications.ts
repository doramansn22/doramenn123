import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission() {
  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  if (existingStatus === "granted") {
    return true;
  }

  const { status } =
    await Notifications.requestPermissionsAsync();

  return status === "granted";
}

export async function scheduleMaintenanceReminder(
  applianceName: string,
  task: string,
  dueDate: Date
) {
  const permissionGranted =
    await requestNotificationPermission();

  if (!permissionGranted) {
    return null;
  }

  const triggerDate = new Date(dueDate);

  if (triggerDate.getTime() <= Date.now()) {
    return null;
  }

  const notificationId =
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🔔 HomeAI Maintenance Reminder",
        body: `${task} is due for ${applianceName}.`,
        sound: "default",
        data: {
          applianceName,
          task,
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
      },
    });

  return notificationId;
}

export async function cancelMaintenanceReminder(
  notificationId: string
) {
  try {
    await Notifications.cancelScheduledNotificationAsync(
      notificationId
    );
  } catch (error) {
    console.log(
      "Error cancelling maintenance reminder:",
      error
    );
  }
}