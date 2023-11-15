import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";

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
      <MaterialIcons name="info-outline" size={24} color="#000" />
    </TouchableOpacity>
  );
}
