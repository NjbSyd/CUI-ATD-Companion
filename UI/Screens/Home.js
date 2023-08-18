import React, {useCallback, useEffect} from "react";
import {BackHandler, Dimensions, ScrollView, StyleSheet, View} from "react-native";
import {useFocusEffect} from "@react-navigation/native";
import {RenderButton} from "../Components/MainScreenButton";
import {handleBackPress} from "../Functions/UIHelpers";
import BannerAds from "../../Ads/BannerAd";
import {LoadAndDisplayInterstitialAd} from "../../Ads/InterstitialAd";

const Main = ({navigation}) => {
  useFocusEffect(
      useCallback(() => {
        const onBackPress = handleBackPress;
        BackHandler.addEventListener("hardwareBackPress", onBackPress);
        return () =>
            BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      }, [])
  );
  useEffect(() => {
    const unsub = LoadAndDisplayInterstitialAd();
    return () => unsub()
  }, [])
  const screenWidth = Dimensions.get("window").width;
  const buttonsPerRow = 2;
  const buttonWidth = screenWidth / buttonsPerRow - 20;
  return (
      <View style={styles.container}>
        <View style={styles.space}/>
        <ScrollView>
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
                "Login",
                "Login to SIS.CUI.ATD",
                false,
                buttonWidth,
                navigation
            )}
          </View>
        </ScrollView>
        <BannerAds/>
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
    maxWidth: "100%",
    marginTop: 10,
    marginHorizontal: 10,
  },
});

export default Main;
