import * as Updates from "expo-updates";

export function updateApp() {
  try {
    Updates.checkForUpdateAsync().then((update) => {
      if (update.isAvailable) {
        Updates.fetchUpdateAsync().then(() => {
          Updates.reloadAsync().then((r) => console.log(r));
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
}
