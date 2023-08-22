import {Image, Text, StyleSheet, TouchableOpacity, View} from "react-native";
import {FontAwesome5} from "@expo/vector-icons";
import React from "react";

const RenderButton = (
    iconName,
    screenName,
    screenDescription,
    icon = true,
    disabled = false,
    buttonWidth,
    navigation
) => {
  return (
      <View style={disabled&&{
        opacity: 0.5,
      }}>
        <TouchableOpacity
            disabled={disabled}
            style={[styles.button, {width: buttonWidth, height: buttonWidth + 20}]}
            onPress={() => navigation.navigate(screenName)}
        >
          {icon ? (
              <FontAwesome5 name={iconName} size={50} color="white"/>
          ) : (
               <Image
                   style={{
                     width: "40%",
                     height: "40%",
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
              }}
          >
            {screenDescription}
          </Text>
        </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(15, 44, 76)",
    marginVertical: 10,
    borderRadius: 10,
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

export {RenderButton};
