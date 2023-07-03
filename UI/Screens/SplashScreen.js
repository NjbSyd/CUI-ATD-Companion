import { View, StyleSheet, Image, Text } from "react-native";
import AnimatedLottieView from "lottie-react-native";
import { useEffect, useState } from "react";
import { fetchDataAndStore } from "../../BackEnd/RequestGenerator";
import { useDispatch } from "react-redux";

export default function SplashScreen({ navigation }) {
  const StateDispatcher = useDispatch();
  const [initialAnimationDone, setInitialAnimationDone] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading...");
  useEffect(() => {
    setLoadingText("Checking Internet Connection...");
  }, []);

  const onAnimationFinish = async () => {
    setInitialAnimationDone(true);
    try {
      await fetchDataAndStore(setLoadingText, StateDispatcher);
      navigation.navigate("ApplicationEntry");
    } catch (error) {
      setLoadingText(error.message);
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <AnimatedLottieView
        style={styles.splashContainer}
        source={require("../../assets/SplashScreen.json")}
        resizeMode="center"
        autoPlay
        speed={0.7}
        loop={false}
        onAnimationFinish={onAnimationFinish}
        autoSize
      />
      {initialAnimationDone && (
        <>
          <AnimatedLottieView
            style={styles.progressContainer}
            source={require("../../assets/Progress.json")}
            resizeMode="center"
            autoPlay
            loop
            autoSize
          />
          <Image
            style={styles.image}
            source={require("../../assets/icon.png")}
          />
          <View
            style={{ position: "absolute", bottom: "27%", alignSelf: "center" }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "rgb(255,255,255)",
                marginVertical: 40,
                alignSelf: "center",
                fontWeight: "100",
                letterSpacing: 1,
              }}
            >
              {loadingText}
            </Text>
          </View>
          <View
            style={{ position: "absolute", bottom: "5%", alignSelf: "center" }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "rgba(255,255,255,0.2)",
                fontStyle: "italic",
                includeFontPadding: true,
                letterSpacing: 3,
              }}
            >
              Made with ❤ by NS
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
    width: "100%",
    height: "40%",
    zIndex: 1,
    alignSelf: "center",
    position: "absolute",
    top: "20%",
  },
});
