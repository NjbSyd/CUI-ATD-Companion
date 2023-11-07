import { View, StyleSheet, Image, Text, Dimensions } from "react-native";
import AnimatedLottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useFonts } from "expo-font";
import { updateDataFromServerIfNeeded } from "../../BackEnd/DataHandlers/ServerSideDataHandler";
import { initializeAllDatabasesAndTables } from "../../BackEnd/SQLiteFunctions";
import { fakeSleep } from "../Functions/UIHelpers";
import { fetchDataFromSQLite } from "../../BackEnd/DataHandlers/FrontEndDataHandler";
import { useIsFocused } from "@react-navigation/native";
import { updateApp } from "../../BackEnd/OTAUpdates";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function SplashScreen({ navigation }) {
  const focused = useIsFocused();
  useEffect(() => {
    if (focused) {
      animationRef.current?.play();
      fetchDataAndSetupAppEnvironment().then(() => {});
    }
    return () => {
      setInitialAnimationDone(false);
      setLoadingText("Loading...");
    };
  }, [focused]);
  const animationRef = useRef(null);
  const [fontLoaded] = useFonts({
    bricolage: require("../../assets/Fonts/BricolageGrotesque.ttf"),
  });
  const [initialAnimationDone, setInitialAnimationDone] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading...");
  const StateDispatcher = useDispatch();
  const fetchDataAndSetupAppEnvironment = async () => {
    try {
      updateApp();
      setLoadingText("Loading...");
      await fakeSleep(100);
      await initializeAllDatabasesAndTables();
      await fakeSleep(100);
      const response = await updateDataFromServerIfNeeded(setLoadingText);
      if (response === "Error") {
        navigation.navigate("Error", {
          message: {
            title: "Server Connection Error",
            message: "Please check your internet connection and try again.",
          },
        });
        return;
      } else if (
        typeof response === "object" &&
        response?.title.toUpperCase().includes("UPDATE")
      ) {
        navigation.navigate("Error", { message: response });
        return;
      }
      await fakeSleep(1000);
      setLoadingText("Setting up the environment...");
      await fakeSleep(100);
      await fetchDataFromSQLite(StateDispatcher, "all");
      await fakeSleep(100);
      navigation.navigate("ApplicationEntry");
    } catch (error) {
      navigation.navigate("Error", {
        message: {
          title: "Something Went Wrong!",
          message: error.message,
        },
      });
    }
  };

  return (
    <View style={styles.mainContainer}>
      {!initialAnimationDone && (
        <AnimatedLottieView
          ref={animationRef}
          style={styles.splashContainer}
          source={require("../../assets/Images/SplashScreen.json")}
          resizeMode="center"
          speed={1.25}
          loop={false}
          onAnimationFinish={() => {
            setInitialAnimationDone(true);
          }}
          autoSize
        />
      )}
      {initialAnimationDone && (
        <>
          <Image
            style={styles.image}
            source={require("../../assets/Images/icon.png")}
          />
          <AnimatedLottieView
            style={styles.progressContainer}
            source={require("../../assets/Images/Progress.json")}
            resizeMode="center"
            autoPlay
            loop
            autoSize
          />
          <Text
            style={[
              styles.progressText,
              {
                fontFamily: fontLoaded ? "bricolage" : null,
              },
            ]}
          >
            {loadingText}
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    alignSelf: "center",
    width: windowWidth,
    aspectRatio: 4.5,
    marginBottom: -windowWidth * 0.1,
    marginTop: -windowWidth * 0.05,
    zIndex: 2,
  },
  splashContainer: {
    width: windowWidth,
    height: windowHeight,
    alignSelf: "center",
  },
  image: {
    maxWidth: windowWidth * 0.8,
    maxHeight: windowHeight * 0.4,
    zIndex: -1,
    alignSelf: "center",
  },
  tipText: {
    marginHorizontal: 20,
    textAlign: "left",
    letterSpacing: 0.5,
    color: "red",
  },
  progressText: {
    fontSize: 16,
    color: "black",
    alignSelf: "center",
    textAlign: "center",
    fontWeight: "100",
    letterSpacing: 1,
    zIndex: 3,
  },
  mainContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: windowWidth * 0.4,
  },
});
