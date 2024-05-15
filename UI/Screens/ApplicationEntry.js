import { AntDesign } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text } from "@rneui/themed";
import React from "react";
import { StyleSheet } from "react-native";

import { Classroom } from "./Classroom";
import Freeslots from "./Freeslots";
import Main from "./Home";
import LoginScreen from "./PortalLoginScreen";
import ProfileScreen from "./ProfileScreen";
import StudentPortal from "./StudentPortal";
import { Subjects } from "./Subjects";
import { Teachers } from "./Teachers";
import Timetable from "./Timetable";
import InfoButton from "../Components/InfoButton";
import Theme from "../Constants/Theme";

const Stack = createNativeStackNavigator();

export default function ApplicationEntry() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerRight: () => <InfoButton />,
        headerTitleStyle: headerStyles.title,
        animation: "slide_from_right",
        headerStyle: headerStyles.container,
      }}
    >
      <Stack.Screen
        name="AboutMe"
        component={ProfileScreen}
        options={(props) => ({
          headerRight: () => (
            <AntDesign
              name="close"
              size={Theme.SIZES.FONT * 1.25}
              color="black"
              style={{ marginRight: Theme.SIZES.BASE }}
              onPress={() => props.navigation.goBack()}
            />
          ),
          headerTitle: () => (
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={{
                color: "#7c47d9",
                fontFamily: "bricolage",
                fontSize: 26,
                letterSpacing: 2,
                marginLeft: Theme.SIZES.BASE / 4,
              }}
            >
              About the app
            </Text>
          ),
          headerLeft: () => null,
          headerBackVisible: false,
          headerShadowVisible: false,
          animation: "fade_from_bottom",
        })}
      />
      <Stack.Screen name="Home" component={Main} />
      <Stack.Screen name="Teachers" component={Teachers} />
      <Stack.Screen name="Classrooms" component={Classroom} />
      <Stack.Screen name="Subjects" component={Subjects} />
      <Stack.Screen name="Timetable" component={Timetable} />
      <Stack.Screen
        name="Portal"
        component={StudentPortal}
        options={(props) => ({
          headerTitle: (props) => {
            return (
              <Text adjustsFontSizeToFit numberOfLines={1}>
                {props.children}
              </Text>
            );
          },
          headerRight: () => null,
          headerLeft: () => (
            <AntDesign
              name="close"
              size={Theme.SIZES.FONT * 1.25}
              color="black"
              style={{ marginRight: Theme.SIZES.BASE }}
              onPress={() => props.navigation.goBack()}
            />
          ),
          headerBackVisible: false,
          animation: "fade_from_bottom",
        })}
      />
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
  },
  image: {
    width: 50,
    height: 50,
    alignSelf: "center",
  },
});
