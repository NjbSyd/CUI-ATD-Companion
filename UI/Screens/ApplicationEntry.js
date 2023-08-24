import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HeaderImage, headerStyles } from "../Components/Header";
import { Teachers } from "./Teachers";
import { Classroom } from "./Classroom";
import { Subjects } from "./Subjects";
import Main from "./Home";
import { useDispatch } from "react-redux";
import Timetable from "./Timetable";
import StudentPortal from "./StudentPortal";
import LoginScreen from "./Login";
import { useFonts } from "expo-font";
import Freeslots from "./Freeslots";

const Stack = createNativeStackNavigator();

export default function ApplicationEntry() {
  const [fontLoaded] = useFonts({
    bricolage: require("../../assets/Fonts/BricolageGrotesque.ttf"),
  });
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerRight: () => <HeaderImage />,
        headerTitleStyle: [{ fontFamily: "bricolage" }, headerStyles.title],
        animation: "slide_from_right",
      }}
    >
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
