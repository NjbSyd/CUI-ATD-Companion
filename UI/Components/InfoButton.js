import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function InfoButton() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={{
        borderRadius: 50,
      }}
      onPress={() => {
        navigation.navigate("AboutMe");
      }}
    >
      <MaterialIcons name="info-outline" size={24} color="black" />
    </TouchableOpacity>
  );
}
