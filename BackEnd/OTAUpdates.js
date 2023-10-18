import * as Updates from "expo-updates";
import { Alert } from "react-native";

export function updateApp() {
  try {
    Updates.checkForUpdateAsync().then((update) => {
      if (update.isAvailable) {
        Updates.fetchUpdateAsync().then(() => {
          setTimeout(() => {
            Updates.reloadAsync().then((r) => console.log(r));
          }, 3000);
          Alert.alert("Update", "App is updated. Restarting in 3 seconds.");
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
}
