import React from "react";
import { View, Modal, StyleSheet, Text } from "react-native";
import AnimatedLottieView from "lottie-react-native";
import { useFonts } from "expo-font";

const LoadingPopup = ({ visible, text }) => {
  const [fontLoaded] = useFonts({
    bricolage: require("../../assets/Fonts/BricolageGrotesque.ttf"),
  });
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.container}>
        <View style={styles.popup}>
          <AnimatedLottieView
            style={styles.animation}
            source={require("../../assets/Images/Loading.json")}
            autoPlay
            autoSize={true}
          />
          {text && (
            <Text
              style={[
                styles.text,
                { fontFamily: "bricolage" },
                text.length >= 25 && { fontSize: 14 },
              ]}
            >
              {text}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  popup: {
    width: "70%",
    height: "18%",
    backgroundColor: "rgb(15, 44, 76)",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowColor: "white",
    padding: 5,
  },
  animation: {
    flex: 1,
    alignSelf: "center",
  },
  text: {
    fontSize: 21,
    color: "#fff",
  },
});

export default LoadingPopup;
