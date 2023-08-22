import * as Updates from "expo-updates";

async function onFetchUpdateAsync(setLoadingText) {
  try {
    setLoadingText("Checking for updates...");
    const update = await Updates.checkForUpdateAsync();

    if (update.isAvailable) {
      setLoadingText("Downloading updates...");
      await Updates.fetchUpdateAsync();
      setLoadingText("Installing updates...");
      await Updates.reloadAsync();
    }
  } catch (error) {
    alert(`Error fetching latest Expo update: ${error}`);
  }
}

export {onFetchUpdateAsync}