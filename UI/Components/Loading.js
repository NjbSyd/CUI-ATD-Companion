import React from "react";
import { View, Modal, StyleSheet, Text, ActivityIndicator } from "react-native";

const LoadingPopup = ({ visible, text }) => {
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.container}>
        <View style={styles.popup}>
          <ActivityIndicator
            style={styles.animation}
            size="large"
            color="black"
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
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  popup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    height: "8%",
    padding: 10,
    backgroundColor: "#ccc",
  },
  animation: {
    position: "absolute",
    left: 10,
  },
  text: {
    fontSize: 21,
  },
});

export default LoadingPopup;
