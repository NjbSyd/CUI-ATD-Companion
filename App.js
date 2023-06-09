import {LogBox} from 'react-native';
import {useEffect} from "react";
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {StatusBar} from "expo-status-bar";
import {Teachers} from "./UI/Screens/Teachers";
import {Classroom} from "./UI/Screens/Classroom";
import {fetchAndSaveDataFromFB} from "./BackEnd/SqliteFX";

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