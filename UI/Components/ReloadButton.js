import React, { useRef } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity, Animated, ToastAndroid } from "react-native";
import { FetchDataFromSQLite } from "../../BackEnd/RequestGenerator";

function ReloadButton({ StateDispatcher }) {
  const rotateValue = useRef(new Animated.Value(0)).current;

  const startRotation = () => {
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      })
    ).start();
  };

  const stopRotation = () => {
    rotateValue.stopAnimation();
  };

  const rotation = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const iconStyle = {
    transform: [{ rotate: rotation }],
  };

  return (
    <>
      <TouchableOpacity
        style={{
          alignSelf: "center",
          columnGap: 20,
        }}
        onPress={async () => {
          startRotation();
          await FetchDataFromSQLite(() => {}, StateDispatcher, "Local Cache");
          stopRotation();
          ToastAndroid.show("Reloaded Successfully✅", ToastAndroid.SHORT);
        }}
      >
        <Animated.View style={iconStyle}>
          <MaterialCommunityIcons name={"reload"} size={30} color="black" />
        </Animated.View>
      </TouchableOpacity>
    </>
  );
}

export { ReloadButton };
