import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet } from "react-native";

import { Classroom } from "./Classroom";
import Freeslots from "./Freeslots";
import Main from "./Home";
import LoginScreen from "./Login";
import ProfileScreen from "./ProfileScreen";
import StudentPortal from "./StudentPortal";
import { Subjects } from "./Subjects";
import { Teachers } from "./Teachers";
import Timetable from "./Timetable";
import InfoButton from "../Components/InfoButton";

const Stack = createNativeStackNavigator();

export default function ApplicationEntry() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerRight: () => <InfoButton />,
        headerTitleStyle: [{ fontFamily: "bricolage" }, headerStyles.title],
        animation: "slide_from_right",
        headerStyle: headerStyles.container,
      }}
    >
      <Stack.Screen name="AboutMe" component={ProfileScreen} />
      <Stack.Screen name="Home" component={Main} />
      <Stack.Screen name="Teachers" component={Teachers} />
      <Stack.Screen name="Classrooms" component={Classroom} />
      <Stack.Screen name="Subjects" component={Subjects} />
      <Stack.Screen name="Timetable" component={Timetable} />
      <Stack.Screen name="Portal" component={StudentPortal} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Freeslots" component={Freeslots} />
    </Stack.Navigator>
  );
}

const headerStyles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    marginTop: "7%",
  },
  title: {
    fontSize: 28,
    color: "black",
    backgroundColor: "transparent",
  },
  image: {
    width: 50,
    height: 50,
    alignSelf: "center",
  },
});
