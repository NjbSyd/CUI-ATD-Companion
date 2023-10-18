import * as Updates from "expo-updates";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function updateApp() {
  try {
    Updates.checkForUpdateAsync().then((update) => {
      if (update.isAvailable) {
        Updates.fetchUpdateAsync().then(() => {
          alert("App is updated\nPlease restart the app to see changes");
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
}
