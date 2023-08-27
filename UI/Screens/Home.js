import React, { useCallback, useEffect, useState } from "react";
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
import { FetchDataFromSQLite } from "../../BackEnd/RequestGenerator";
import { useDispatch } from "react-redux";
import LoadingPopup from "../Components/Loading";
import useInterstitialAd from "../../Ads/InterstitialAd";
import { ThreeDotMenu } from "../Components/ThreeDotMenu";
import { useIsFocused } from "@react-navigation/native";

const Main = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [numberOfFocus, setNumberOfFocus] = useState(0);
  const { loadedAd, displayAd } = useInterstitialAd();

  const StateDispatcher = useDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading ...");

  const reloadData = async () => {
    setTimeout(async () => {
      setLoading(true);
      try {
        await FetchDataFromSQLite(() => {}, StateDispatcher, "Local Cache");
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }, 2000);
  };
  useEffect(() => {
    if (isFocused) {
      setNumberOfFocus((prevCount) => prevCount + 1);

      if (numberOfFocus === 0) {
        reloadData().then(() => {});
        navigation.setOptions({
          headerLeft: () => <></>,
          headerRight: () => (
            <ThreeDotMenu
              StateDispatcher={StateDispatcher}
              SetLoadingText={setLoadingText}
              SetLoading={setLoading}
            />
          ),
        });
      } else {
        if (loadedAd) {
          displayAd();
        }
      }
    }
  }, [isFocused]);

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
      <LoadingPopup visible={loading} text={loadingText} />
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
