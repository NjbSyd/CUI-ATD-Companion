import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { useFonts } from "expo-font";
import { BackgroundImage } from "@rneui/base";
import Theme from "../Constants/Theme";

const buttonWidth = Theme.HomeScreenButtonWidth;

const RenderButton = ({
  iconName,
  screenName,
  screenDescription,
  disabled = false,
  navigation,
  loadedAd,
  showAd,
}) => {
  const [fontLoaded] = useFonts({
    bricolage: require("../../assets/Fonts/BricolageGrotesque.ttf"),
  });
  return (
    <View
      style={
        disabled && {
          opacity: 0.5,
        }
      }
    >
      <TouchableOpacity
        disabled={disabled}
        style={[
          styles.button,
          { width: buttonWidth, height: buttonWidth + buttonWidth * 0.15 },
        ]}
        onPress={() => {
          if (loadedAd) {
            try {
              showAd();
            } catch (e) {
              console.log(e);
            }
          }
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
              padding: buttonWidth / 7,
            }}
          >
            <FontAwesome5
              name={iconName}
              size={buttonWidth / 4}
              color="white"
            />
            <Text style={styles.buttonText}>{screenName}</Text>
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontSize: 12,
                margin: buttonWidth / 20,
                fontFamily: "bricolage",
              }}
            >
              {screenDescription}
            </Text>
          </View>
        </BackgroundImage>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    marginVertical: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  buttonText: {
    color: "white",
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});

export { RenderButton };
