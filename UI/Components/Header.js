import React, { Component } from "react";
import { StyleSheet, View, Text, Image } from "react-native";

export function Header({ title }) {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/logo.png")}
        resizeMode="contain"
        style={styles.image}
      />
      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
    color: "#FFFFFF",
    backgroundColor: "transparent",
  },
  image: {
    width: 58,
    height: 46,
    alignSelf: "center",
  },
});
