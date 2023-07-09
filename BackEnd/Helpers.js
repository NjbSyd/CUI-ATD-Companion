function shouldReloadData(lastSyncDate) {
  if (lastSyncDate === null) return true;
  // Parse the last sync date
  const lastSync = new Date(lastSyncDate);

  // Get the current date and time
  const currentDate = new Date();
  console.log("currentDate:", currentDate);
  console.log("lastSync:", lastSync);
  // Check if the current date is different from the last sync date
  const isDateChanged =
    currentDate.getDate() !== lastSync.getDate() ||
    currentDate.getMonth() !== lastSync.getMonth() ||
    currentDate.getFullYear() !== lastSync.getFullYear();

  console.log("currentDate:", currentDate.getDate());
  console.log("lastSync:", lastSync.getDate());
  console.log("currrentMonth:", currentDate.getMonth());
  console.log("lastSyncMonth:", lastSync.getMonth());
  console.log("currentYear:", currentDate.getFullYear());
  console.log("lastSyncYear:", lastSync.getFullYear());

  // Check if the current time is past 06:40 AM
  const isPastTime =
    currentDate.getHours() > 6 ||
    (currentDate.getHours() === 6 && currentDate.getMinutes() >= 40);
  // Return true if the date has changed and it's past 06:40 AM
  console.log("isDateChanged:", isDateChanged);
  console.log("isPastTime:", isPastTime);
  console.log(currentDate);
  console.log(lastSyncDate);
  return isDateChanged && isPastTime;
}

export { shouldReloadData };
