import * as Updates from "expo-updates";

export async function updateApp(setLoadingText) {
  try {
    setLoadingText("Checking for updates...");
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      setLoadingText("Downloading updates...");
      await Updates.fetchUpdateAsync();
      setLoadingText("Installing updates...");
      await Updates.reloadAsync();
    } else {
      setLoadingText("No updates available");
    }
  } catch (error) {
    console.log(error);
  }
}
