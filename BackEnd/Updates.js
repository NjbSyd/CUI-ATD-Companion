import * as Updates from "expo-updates";

async function onFetchUpdateAsync(setLoadingText) {
  try {
    setLoadingText("Checking for App Updates...");
    const update = await Updates.checkForUpdateAsync();

    if (update.isAvailable) {
      setLoadingText("Downloading App Updates...");
      await Updates.fetchUpdateAsync();
      setLoadingText("Installing App Updates...");
      setLoadingText("Restarting App ...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await Updates.reloadAsync();
    } else {
      setLoadingText("App is Up-to-date!");
    }
  } catch (error) {
    setLoadingText("Error Downloading App Updates!");
  }
}

export { onFetchUpdateAsync };
