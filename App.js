import {Image, LogBox, Text} from 'react-native';
import {useEffect} from "react";
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {StatusBar} from "expo-status-bar";
import {Teachers} from "./UI/Screens/Teachers";
import {Classroom} from "./UI/Screens/Classroom";

const Tabs = createBottomTabNavigator();
export default function App() {
  useEffect(() => {
    LogBox.ignoreAllLogs(true);
  });
  return (
      <NavigationContainer>
        <Tabs.Navigator
            initialRouteName="Teachers"
            screenOptions={({route}) => ({
              headerLeft: ()=><Image source={require("./assets/logo.png")} style={{width:37,height:44,marginLeft:"35%",marginRight:"-35%" }} />,
              tabBarIcon: ({color, size}) => {
                let rn = route.name;
                let iconName = rn === 'Classrooms' ? 'google-classroom'
                                                   : rn === 'Timetable' ? 'timetable'
                                                                        : rn === 'Teachers' ? 'account-tie' : 'question';
                return <MaterialCommunityIcons name={iconName} size={size} color={color}/>;
              },
              headerStyle: {
                backgroundColor: 'rgb(2, 201, 208)',
                height: 80,
              }
            })}>
          <Tabs.Screen name="Teachers" component={Teachers} />
          <Tabs.Screen name="Classrooms" component={Classroom}/>
        </Tabs.Navigator>
        <StatusBar style="auto"/>
      </NavigationContainer>
  );
}