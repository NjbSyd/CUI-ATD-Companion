import {
  View,
  StyleSheet,
  Image,
  Text,
  Alert,
  BackHandler,
} from "react-native";
import AnimatedLottieView from "lottie-react-native";
import { useEffect, useState } from "react";
import { fetchDataAndStore } from "../../BackEnd/RequestGenerator";

export function SplashScreen({ navigation }) {
  const [initialAnimationDone, setInitialAnimationDone] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading...");
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchDataAndStore(setLoadingText);
      } catch (error) {
        console.error(error);
        Alert.alert("Error Occured", "Please Try Again Later", [
          {
            text: "OK",
            onPress: () => {
              BackHandler.exitApp();
            },
          },
        ]);
      }
    };

    const onAnimationFinish = async () => {
      setInitialAnimationDone(true);
      await fetchData();
      navigation.navigate("Main");
    };

    const animationTimeout = setTimeout(onAnimationFinish, 3000);

    return () => {
      clearTimeout(animationTimeout);
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <AnimatedLottieView
        style={styles.splashContainer}
        source={require("../../assets/SplashScreen.json")}
        resizeMode="center"
        autoPlay
        speed={0.7}
        loop={false}
        onAnimationFinish={() => {
          setInitialAnimationDone(true);
        }}
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
