import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";

export function Header({ title }) {
  return (
    <View style={headerStyles.container}>
      <Image
        source={require("../../assets/logo.png")}
        resizeMode="contain"
        style={headerStyles.image}
      />
      <Text numberOfLines={1} style={headerStyles.title}>
        {title}
      </Text>
    </View>
  );
}
export const HeaderImage = () => {
  return (
    <Image
      source={require("../../assets/logo.png")}
      resizeMode="contain"
      style={headerStyles.image}
    />
  );
};

export const headerStyles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "rgb(15, 44, 76)",
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    shadowColor: "#111",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 1.2,
    elevation: 30,
    marginTop: "7%",
  },
  title: {
    fontSize: 28,
    color: "rgb(15, 44, 76)",
    backgroundColor: "transparent",
  },
  image: {
    width: 50,
    height: 50,
    alignSelf: "center",
  },
});
