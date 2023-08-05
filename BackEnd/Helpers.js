import { Alert, BackHandler } from "react-native";

function shouldReloadData(lastSyncDate) {
  if (lastSyncDate === null) return true;
  // Parse the last sync date
  const lastSync = new Date(lastSyncDate);

  // Get the current date and time
  const currentDate = new Date();

  // Check if the current date is different from the last sync date
  const isDateChanged =
    currentDate.getDate() !== lastSync.getDate() ||
    currentDate.getMonth() !== lastSync.getMonth() ||
    currentDate.getFullYear() !== lastSync.getFullYear();

  // Check if the current time is past 06:40 AM
  const isPastTime =
    currentDate.getHours() > 6 ||
    (currentDate.getHours() === 6 && currentDate.getMinutes() >= 40);

  // Return true if the date has changed, and it's past 06:40 AM
  return isDateChanged && isPastTime;
}

export { shouldReloadData };
