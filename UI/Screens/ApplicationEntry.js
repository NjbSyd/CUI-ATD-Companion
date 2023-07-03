import { BackHandler, Alert, Image, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HeaderImage, headerStyles } from "../Components/Header";
import { Teachers } from "./Teachers";
import { Classroom } from "./Classroom";
import { Subjects } from "./Subjects";
import Main from "./Home";

const Stack = createNativeStackNavigator();

export default function ApplicationEntry() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerRight: () => <HeaderImage />,
        headerTitleStyle: headerStyles.title,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="Home"
        component={Main}
        options={{
          headerLeft: () => <></>,
          headerRight: () => <></>,
        }}
      />
      <Stack.Screen name="Teachers" component={Teachers} />
      <Stack.Screen name="Classrooms" component={Classroom} />
      <Stack.Screen name="Subjects" component={Subjects} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  photo: {
    width: 200,
    height: 200,
    marginLeft: 80,
  },
});
