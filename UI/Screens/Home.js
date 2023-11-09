import React, { useCallback, useEffect } from "react";
import { BackHandler, ScrollView, StyleSheet, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { RenderButton } from "../Components/MainScreenButton";
import { handleBackPress } from "../Functions/UIHelpers";
import BannerAds from "../../Ads/BannerAd";
import useInterstitialAd from "../../Ads/InterstitialAd";
import { HomeButtonsData } from "../Constants/HomeButtons";
import Theme from "../Constants/Theme";

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

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Theme.COLORS.WHITE,
      }}
    >
      <ScrollView
        style={{
          height: Theme.ScreenHeight * 0.9,
          flex: 1,
        }}
        contentContainerStyle={styles.buttonContainer}
      >
        {HomeButtonsData.map((button, index) => (
          <RenderButton
            key={(button.screenName + index).toString()}
            iconName={button.iconName}
            screenName={button.screenName}
            screenDescription={button.screenDescription}
            navigation={navigation}
            loadedAd={loadedAd}
            showAd={displayAd}
          />
        ))}
      </ScrollView>
      <BannerAds />
    </View>
  );
};

const styles = StyleSheet.create({
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
