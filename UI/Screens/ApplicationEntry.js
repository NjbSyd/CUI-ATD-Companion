import { Teachers } from "./Teachers";
import { FontAwesome5 } from "@expo/vector-icons";
import { Classroom } from "./Classroom";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

const Tabs = createMaterialBottomTabNavigator();

export function ApplicationEntry() {
  return (
    <Tabs.Navigator
      backBehavior="firstRoute"
      shifting={true}
      tabBarBadge={false}
      initialRouteName={"Teachers"}
      barStyle={{
        backgroundColor: "rgb(15, 44, 76)",
        height: "8%",
      }}
    >
      <Tabs.Screen
        name="Teachers"
        component={Teachers}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <FontAwesome5
              name="chalkboard-teacher"
              color={focused ? color : "white"}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Classrooms"
        component={Classroom}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <MaterialCommunityIcons
              name="google-classroom"
              color={focused ? color : "white"}
              size={26}
            />
          ),
        }}
      />
    </Tabs.Navigator>
  );
}
