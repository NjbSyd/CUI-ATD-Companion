import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { LogBox } from "react-native";
import { Provider } from "react-redux";

import { MyStore } from "./Redux/Store";
import ApplicationEntry from "./UI/Screens/ApplicationEntry";
import ErrorScreen from "./UI/Screens/ErrorScreen";
import SplashScreen from "./UI/Screens/SplashScreen";
import { loadFonts } from "./UI/Functions/UIHelpers";

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    LogBox.ignoreAllLogs(true);
    loadFonts().then(null);
  }, []);
  return (
    <Provider store={MyStore}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            headerLeft: () => null,
            animation: "slide_from_bottom",
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen
            name="ApplicationEntry"
            component={ApplicationEntry}
            options={{
              gestureEnabled: false,
            }}
            getId={() => "ApplicationEntry"}
          />
          <Stack.Screen name="Error" component={ErrorScreen} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </Provider>
  );
}
