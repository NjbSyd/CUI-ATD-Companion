import { View, StyleSheet, Image, Text } from "react-native";
import AnimatedLottieView from "lottie-react-native";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useFonts } from "expo-font";
import { onFetchUpdateAsync } from "../../BackEnd/Updates";
import { updateDataFromServerIfNeeded } from "../../BackEnd/DataHandlers/ServerSideDataHandler";
import { initializeAllDatabasesAndTables } from "../../BackEnd/SQLiteFunctions";
import { fakeSleep } from "../Functions/UIHelpers";
import { fetchDataFromSQLite } from "../../BackEnd/DataHandlers/FrontEndDataHandler";

export default function SplashScreen({ navigation }) {
  const [fontLoaded] = useFonts({
    bricolage: require("../../assets/Fonts/BricolageGrotesque.ttf"),
  });
  const [initialAnimationDone, setInitialAnimationDone] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading...");
  const StateDispatcher = useDispatch();
  const onAnimationFinish = async () => {
    setInitialAnimationDone(true);
    try {
      await onFetchUpdateAsync(setLoadingText);
      setLoadingText("Loading...");
      await fakeSleep(2000);
      await initializeAllDatabasesAndTables();
      await fakeSleep(2000);
      await updateDataFromServerIfNeeded(setLoadingText);
      await fakeSleep(2000);
      setLoadingText("Setting up the environment...");
      await fetchDataFromSQLite(StateDispatcher, "all");
      navigation.navigate("ApplicationEntry");
    } catch (error) {
      setLoadingText(error);
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <AnimatedLottieView
        style={styles.splashContainer}
        source={require("../../assets/Images/SplashScreen.json")}
        resizeMode="center"
        autoPlay
        speed={1}
        loop={false}
        onAnimationFinish={onAnimationFinish}
        autoSize
      />
      {initialAnimationDone && (
        <>
          <AnimatedLottieView
            style={styles.progressContainer}
            source={require("../../assets/Images/Progress.json")}
            resizeMode="center"
            autoPlay
            loop
            autoSize
          />
          <Image
            style={styles.image}
            source={require("../../assets/Images/icon.png")}
          />
          <View
            style={{ position: "absolute", bottom: "27%", alignSelf: "center" }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "black",
                marginVertical: 40,
                alignSelf: "center",
                textAlign: "center",
                fontWeight: "100",
                letterSpacing: 1,
                fontFamily: fontLoaded ? "bricolage" : null,
              }}
            >
              {loadingText}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    position: "absolute",
    alignSelf: "center",
    bottom: "10%",
    width: "100%",
  },
  splashContainer: {
    width: "1000%",
    height: "100%",
    alignSelf: "center",
  },
  image: {
    width: "80%",
    height: "40%",
    zIndex: 1,
    alignSelf: "center",
    position: "absolute",
    top: "20%",
  },
  tipText: {
    marginHorizontal: 20,
    textAlign: "left",
    letterSpacing: 0.5,
    position: "absolute",
    bottom: "10%",
    color: "red",
  },
});
