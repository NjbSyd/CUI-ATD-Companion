import "react-native-gesture-handler";
import { LogBox } from "react-native";
import { useEffect } from "react";
import ApplicationEntry from "./UI/Screens/ApplicationEntry";
import { NavigationContainer } from "@react-navigation/native";
import SplashScreen from "./UI/Screens/SplashScreen";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { MyStore } from "./Redux/Store";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Update from "expo-updates";

const ReactToUpdates = async () => {
  Update.addListener((event) => {
    if (event.type === Update.UpdateEventType.UPDATE_AVAILABLE) {
      Update.reloadAsync();
    }
  });
};

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    ReactToUpdates()
      .then(() => {
        console.log("Reacting to updates");
      })
      .catch((e) => {
        console.log("Error reacting to updates: " + e);
      });
    LogBox.ignoreAllLogs(true);
  });
  return (
    <Provider store={MyStore}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={"Splash"}
          screenOptions={{
            headerShown: false,
            headerLeft: () => null,
          }}
        >
          <Stack.Screen name={"Splash"} component={SplashScreen} />
          <Stack.Screen
            name={"ApplicationEntry"}
            component={ApplicationEntry}
            options={{
              gestureEnabled: false,
            }}
            getId={() => "ApplicationEntry"}
          />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </Provider>
  );
}
