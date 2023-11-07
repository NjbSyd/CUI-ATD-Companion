import React, { useCallback, useEffect } from "react";
import {
  BackHandler,
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { RenderButton } from "../Components/MainScreenButton";
import { handleBackPress } from "../Functions/UIHelpers";
import BannerAds from "../../Ads/BannerAd";
import useInterstitialAd from "../../Ads/InterstitialAd";

const Main = ({ navigation }) => {
  const { loadedAd, displayAd } = useInterstitialAd();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <></>,
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (loadedAd) {
        displayAd();
      }
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
      <ScrollView>
        <View style={styles.buttonContainer}>
          {RenderButton(
            "chalkboard-teacher",
            "Teachers",
            "See a Teacher's schedule",
            true,
            false,
            buttonWidth,
            navigation,
            loadedAd,
            displayAd
          )}
          {RenderButton(
            "university",
            "Classrooms",
            "Search details based on RoomNo & TimeSlot",
            true,
            false,
            buttonWidth,
            navigation,
            loadedAd,
            displayAd
          )}
          {RenderButton(
            "book",
            "Subjects",
            "Check assigned Teachers for a Subject",
            true,
            false,
            buttonWidth,
            navigation,
            loadedAd,
            displayAd
          )}
          {RenderButton(
            "calendar-alt",
            "Timetable",
            "Check a Class schedule",
            true,
            false,
            buttonWidth,
            navigation,
            loadedAd,
            displayAd
          )}
          {RenderButton(
            "user",
            "Login",
            "Login to SIS.CUI.ATD",
            false,
            false,
            buttonWidth,
            navigation,
            loadedAd,
            displayAd
          )}
          {RenderButton(
            "calendar-plus",
            "Freeslots",
            "Find free-slots for arranging extra classes",
            true,
            false,
            buttonWidth,
            navigation,
            loadedAd,
            displayAd
          )}
        </View>
      </ScrollView>
      <BannerAds />
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
    height: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    maxWidth: "100%",
    marginTop: 0,
    marginHorizontal: 10,
  },
});

export default Main;
