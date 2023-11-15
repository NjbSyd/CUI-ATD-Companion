import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";

const MagnifierButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={{ alignSelf: "center" }} onPress={onPress}>
      <MaterialIcons name="search" size={35} color="black" />
    </TouchableOpacity>
  );
};

export default MagnifierButton;
