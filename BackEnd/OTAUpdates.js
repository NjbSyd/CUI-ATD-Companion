import * as Updates from "expo-updates";

export function updateApp() {
  try {
    if (!__DEV__) {
      Updates.checkForUpdateAsync().then((update) => {
        if (update.isAvailable) {
          Updates.fetchUpdateAsync().then(() => {
            alert("App is updated\nPlease restart the app to see changes");
          });
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
}
