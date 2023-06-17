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
      initialRouteName={"Classrooms"}
      barStyle={{
        backgroundColor: "rgba(2,201,208,0.1)",
        height: "8%",
      }}
    >
      <Tabs.Screen
        name="Teachers"
        component={Teachers}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="chalkboard-teacher" color={color} size={26} />
          ),
        }}
      />
      <Tabs.Screen
        name="Classrooms"
        component={Classroom}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="google-classroom"
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Tabs.Navigator>
  );
}
