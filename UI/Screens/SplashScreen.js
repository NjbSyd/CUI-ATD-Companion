import { View, StyleSheet, Image, Text } from "react-native";
import AnimatedLottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useFonts } from "expo-font";
import { updateDataFromServerIfNeeded } from "../../BackEnd/DataHandlers/ServerSideDataHandler";
import { initializeAllDatabasesAndTables } from "../../BackEnd/SQLiteFunctions";
import { fakeSleep } from "../Functions/UIHelpers";
import { fetchDataFromSQLite } from "../../BackEnd/DataHandlers/FrontEndDataHandler";
import { useIsFocused } from "@react-navigation/native";

export default function SplashScreen({ navigation }) {
  const focused = useIsFocused();
  useEffect(() => {
    if (focused) {
      setInitialAnimationDone(false);
      animationRef.current?.play();
    }
  }, [focused]);
  const animationRef = useRef(null);
  const [fontLoaded] = useFonts({
    bricolage: require("../../assets/Fonts/BricolageGrotesque.ttf"),
  });
  const [initialAnimationDone, setInitialAnimationDone] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading...");
  const StateDispatcher = useDispatch();
  const onAnimationFinish = async () => {
    setInitialAnimationDone(true);
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
    <View style={{ flex: 1 }}>
      <AnimatedLottieView
        ref={animationRef}
        style={styles.splashContainer}
        source={require("../../assets/Images/SplashScreen.json")}
        resizeMode="center"
        speed={1.5}
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
