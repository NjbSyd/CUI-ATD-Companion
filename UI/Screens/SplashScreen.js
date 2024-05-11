import { useIsFocused } from "@react-navigation/native";
import AnimatedLottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Image, Text, Dimensions } from "react-native";
import { useDispatch } from "react-redux";

import { fetchDataFromSQLite } from "../../BackEnd/DataHandlers/FrontEndDataHandler";
import { updateDataFromServerIfNeeded } from "../../BackEnd/DataHandlers/ServerSideDataHandler";
import { initializeAllDatabasesAndTables } from "../../BackEnd/KnexDB";
import { fakeSleep } from "../Functions/UIHelpers";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function SplashScreen({ navigation }) {
  const focused = useIsFocused();
  useEffect(() => {
    if (focused) {
      animationRef.current?.play();
    }
    return () => {
      setInitialAnimationDone(false);
      setLoadingText("Loading...");
    };
  }, [focused]);
  const animationRef = useRef(null);
  const [initialAnimationDone, setInitialAnimationDone] = useState(false);
  const [loadingText, setLoadingText] = useState("Checking for Updates...");
  const StateDispatcher = useDispatch();
  const fetchDataAndSetupAppEnvironment = async () => {
    try {
      setLoadingText("Loading...");
      await fakeSleep(100);
      await initializeAllDatabasesAndTables();
      await fakeSleep(100);
      const response = await updateDataFromServerIfNeeded(setLoadingText);
      if (response === "Error") {
        navigation.navigate("Error", {
          message: {
            title: "Server Connection Error",
            message:
              "Please check your internet connection and try again after a while.",
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
          source={require("../../assets/Animations/SplashScreen.json")}
          resizeMode="cover"
          speed={1.25}
          loop={false}
          onAnimationFinish={() => {
            setInitialAnimationDone(true);
          }}
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
            source={require("../../assets/Animations/Progress.json")}
            resizeMode="cover"
            autoPlay
            loop
            onAnimationLoaded={() => {
              fetchDataAndSetupAppEnvironment().then(null);
            }}
          />
          <Text
            style={[
              styles.progressText,
              {
                fontFamily: "bricolage",
              },
            ]}
            adjustsFontSizeToFit
            numberOfLines={1}
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
    zIndex: 2,
  },
  splashContainer: {
    width: windowWidth,
    aspectRatio: 1.5,
    transform: [{ scale: 2 }],
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
    fontSize: 18,
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
    paddingTop: windowWidth * 0.35,
  },
});
