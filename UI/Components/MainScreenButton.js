import { Image, Text, StyleSheet, TouchableOpacity, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { useFonts } from "expo-font";
import { BackgroundImage } from "@rneui/base";

const RenderButton = (
  iconName,
  screenName,
  screenDescription,
  icon = true,
  disabled = false,
  buttonWidth,
  navigation,
  loadedAd,
  showAd
) => {
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
          { width: buttonWidth, height: buttonWidth + 20 },
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
            justifyContent: "center",
            alignItems: "center",
          }}
          source={require("../../assets/Images/gradient.png")}
        >
          {icon ? (
            <FontAwesome5 name={iconName} size={50} color="white" />
          ) : (
            <Image
              style={{
                width: "35%",
                height: "35%",
                marginVertical: -5,
                resizeMode: "contain",
              }}
              source={require("../../assets/Images/cui_logo_monochrome.png")}
            />
          )}
          <Text style={styles.buttonText}>{screenName}</Text>
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontSize: 12,
              margin: 20,
              fontFamily: "bricolage",
            }}
          >
            {screenDescription}
          </Text>
        </BackgroundImage>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    // paddingTop: 20,
    // backgroundColor: "rgb(15, 44, 76)",
    marginVertical: 10,
    borderRadius: 10,
    overflow: "hidden",
    height: "35%",
    borderColor: "rgb(15, 44, 76)",
    borderWidth: 1,
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
