import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Teachers } from "./Teachers";
import { Classroom } from "./Classroom";
import { Subjects } from "./Subjects";
import Main from "./Home";
import Timetable from "./Timetable";
import StudentPortal from "./StudentPortal";
import LoginScreen from "./Login";
import { useFonts } from "expo-font";
import Freeslots from "./Freeslots";
import ProfileScreen from "./ProfileScreen";
import InfoButton from "../Components/InfoButton";
import React from "react";
import { StyleSheet } from "react-native";

const Stack = createNativeStackNavigator();

export default function ApplicationEntry() {
  const [fontLoaded] = useFonts({
    bricolage: require("../../assets/Fonts/BricolageGrotesque.ttf"),
  });
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerRight: () => <InfoButton />,
        headerTitleStyle: [{ fontFamily: "bricolage" }, headerStyles.title],
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name={"AboutMe"}
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Home" component={Main} />
      <Stack.Screen name="Teachers" component={Teachers} />
      <Stack.Screen name="Classrooms" component={Classroom} />
      <Stack.Screen name="Subjects" component={Subjects} />
      <Stack.Screen name={"Timetable"} component={Timetable} />
      <Stack.Screen name={"Portal"} component={StudentPortal} />
      <Stack.Screen name={"Login"} component={LoginScreen} />
      <Stack.Screen name={"Freeslots"} component={Freeslots} />
    </Stack.Navigator>
  );
}

const headerStyles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "rgb(15, 44, 76)",
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    shadowColor: "#111",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 1.2,
    elevation: 30,
    marginTop: "7%",
  },
  title: {
    fontSize: 28,
    color: "rgb(15, 44, 76)",
    backgroundColor: "transparent",
  },
  image: {
    width: 50,
    height: 50,
    alignSelf: "center",
  },
});
