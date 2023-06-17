import "react-native-gesture-handler";
import { LogBox } from "react-native";
import { useEffect } from "react";
import { ApplicationEntry } from "./UI/Screens/ApplicationEntry";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { SplashScreen } from "./UI/Screens/SplashScreen";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import store from "./Redux/Store";

const Stack = createStackNavigator();
export default function App() {
  useEffect(() => {
    LogBox.ignoreAllLogs(true);
  });

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name={"Splash"} component={SplashScreen} />
          <Stack.Screen name={"Main"} component={ApplicationEntry} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </Provider>
  );
}
