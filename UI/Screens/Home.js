import React from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const Main = ({ navigation }) => {
  const screenWidth = Dimensions.get("window").width;
  const buttonsPerRow = 2;
  console.log(screenWidth);
  const buttonWidth = screenWidth / buttonsPerRow - 20;

  const renderButton = (iconName, screenName) => {
    return (
      <TouchableOpacity
        style={[styles.button, { width: buttonWidth }]}
        onPress={() => navigation.navigate(screenName)}
      >
        <FontAwesome name={iconName} size={24} color="white" />
        <Text style={styles.buttonText}>{screenName}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/icon.png")} style={styles.photo} />
      <View style={styles.space} />
      <View style={styles.buttonContainer}>
        {renderButton("link", "Screen 1")}
        {renderButton("link", "Screen 2")}
        {renderButton("link", "Screen 3")}
        {renderButton("link", "Screen 4")}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  photo: {
    height: 200,
    width: "100%",
    resizeMode: "center",
    backgroundColor: "red",
  },
  space: {
    height: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    width: "100%",
    marginTop: 10,
    flex: 2,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "cyan",
    marginVertical: 10,
    borderRadius: 10,
    height: "35%",
  },
  buttonText: {
    color: "white",
    marginLeft: 10,
    fontSize: 16,
  },
});

export default Main;
