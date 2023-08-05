import React, { useCallback } from "react";
import { View, StyleSheet, Dimensions, Alert, BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { RenderButton } from "../Components/MainScreenButton";
import { handleBackPress } from "../Functions/UIHelpers";

const Main = ({ navigation }) => {
  useFocusEffect(
    useCallback(() => {
      const onBackPress = handleBackPress;

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );
  const screenWidth = Dimensions.get("window").width;
  const buttonsPerRow = 2;
  const buttonWidth = screenWidth / buttonsPerRow - 20;

  return (
    <View style={styles.container}>
      <View style={styles.space} />
      <View style={styles.buttonContainer}>
        {RenderButton(
          "chalkboard-teacher",
          "Teachers",
          "See a Teacher's schedule",
          true,
          buttonWidth,
          navigation
        )}
        {RenderButton(
          "university",
          "Classrooms",
          "Search details based on RoomNo & TimeSlot",
          true,
          buttonWidth,
          navigation
        )}
        {RenderButton(
          "book",
          "Subjects",
          "Check assigned Teachers for a Subject",
          true,
          buttonWidth,
          navigation
        )}
        {RenderButton(
          "calendar-alt",
          "Timetable",
          "Check a Class schedule",
          true,
          buttonWidth,
          navigation
        )}
        {RenderButton(
          "user",
          "Portal",
          "Login to SIS.CUI.ATD",
          false,
          buttonWidth,
          navigation
        )}
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
    flex: 1,
  },
});

export default Main;
const ScreensData = [
  {
    icon: "chalkboard-teacher",
    title: "Teachers",
    description: "See a Teacher's schedule",
  },
  {
    icon: "university",
    title: "Classrooms",
    description: "Search details based on RoomNo & TimeSlot",
  },
  {
    icon: "book",
    title: "Subjects",
    description: "Check assigned Teachers for a Subject",
  },
  {
    icon: "calendar-alt",
    title: "Timetable",
    description: "Check a Class schedule",
  },
];
