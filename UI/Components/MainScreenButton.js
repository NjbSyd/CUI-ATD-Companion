import { FontAwesome5 } from "@expo/vector-icons";
import { BackgroundImage } from "@rneui/base";
import React from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";

import Theme from "../Constants/Theme";

const buttonWidth = Theme.HomeScreenButtonWidth;

const RenderButton = ({
  iconName,
  screenName,
  screenDescription,
  navigation,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          width: buttonWidth,
          height: buttonWidth + buttonWidth * 0.15,
          flexWrap: "wrap",
        },
      ]}
      onPress={() => {
        navigation.navigate(screenName);
      }}
    >
      <BackgroundImage
        style={{
          width: "100%",
          height: "100%",
          resizeMode: "stretch",
          alignItems: "center",
        }}
        source={require("../../assets/Images/gradient.png")}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            paddingVertical: Theme.ScreenWidth * 0.1,
          }}
        >
          <FontAwesome5 name={iconName} size={buttonWidth / 4} color="white" />
          <Text
            style={styles.buttonText}
            adjustsFontSizeToFit
            numberOfLines={1}
          >
            {screenName}
          </Text>
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontSize: 14,
              margin: Theme.ScreenWidth * 0.01,
              fontFamily: "bricolage",
              width: "85%",
            }}
            adjustsFontSizeToFit
            numberOfLines={2}
          >
            {screenDescription}
          </Text>
        </View>
      </BackgroundImage>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    marginHorizontal: Theme.ScreenWidth * 0.01,
    marginTop: Theme.ScreenWidth * 0.05,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 5,
  },
  buttonText: {
    color: "white",
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    width: "70%",
    textAlign: "center",
    borderRadius: 10,
    letterSpacing: 1,
  },
});

export { RenderButton };
