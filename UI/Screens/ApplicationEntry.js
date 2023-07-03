import { Teachers } from "./Teachers";
import { Classroom } from "./Classroom";
import { Subjects } from "./Subjects";
import Main from "./Home";
import { createNativeStackNavigator } from "react-native-screens/native-stack";

const Stack = createNativeStackNavigator();

export default function ApplicationEntry() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Main} />
      <Stack.Screen name="Teachers" component={Teachers} />
      <Stack.Screen name="Classrooms" component={Classroom} />
      <Stack.Screen name="Subjects" component={Subjects} />
    </Stack.Navigator>
  );
}
