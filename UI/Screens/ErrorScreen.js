import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { BackgroundImage } from "@rneui/base";

const ErrorScreen = ({ route, navigation }) => {
  useEffect(() => {
    if (route.params?.message) {
      setTitle(route.params?.message?.title);
      setMessage(route.params?.message?.message);
      setUpdateNeeded(
        route.params?.message?.title.toUpperCase().includes("UPDATE")
      );
    }
  }, []);
  const [message, setMessage] = useState("An unexpected error occurred.");
  const [title, setTitle] = useState("Error");
  const [updateNeeded, setUpdateNeeded] = useState(false);

  return (
    <BackgroundImage
      source={require("../../assets/Images/gradient.png")}
      style={{
        width: "100%",
        height: "100%",
        resizeMode: "cover",
        opacity: 0.9,
      }}
    >
      <View style={styles.container}>
        <Image
          source={require("../../assets/Images/error.png")} // Replace with your own error graphic
          style={styles.errorIcon}
        />
        <Text style={styles.errorTitle}>{title}</Text>
        <Text style={styles.errorMessage}>{message}</Text>
        <TouchableOpacity
          style={[
            styles.retryButton,
            {
              backgroundColor: updateNeeded ? "green" : "red",
            },
          ]}
          onPress={() => {
            if (title === "Update Needed") {
              Linking.openURL(
                "https://play.google.com/store/apps/details?id=com.njbsyd.cui.unofficial"
              )
                .then(() => {
                  navigation.popToTop();
                })
                .catch(() => {});
            } else {
              navigation.popToTop();
            }
          }}
        >
          <Text style={[styles.retryButtonTxt]}>
            {updateNeeded ? "Update Now" : "Retry"}
          </Text>
          {updateNeeded ? (
            <Ionicons name="logo-google-playstore" size={20} color="white" />
          ) : (
            <Feather name={"refresh-cw"} size={20} color={"white"} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            position: "absolute",
            bottom: 20,
            alignItems: "center",
          }}
          onPress={async () => {
            try {
              let supportEmail = "tcanjb@gmail.com";
              if (await Linking.canOpenURL(`mailto:${supportEmail}`)) {
                // Open the email app
                await Linking.openURL(`mailto:${supportEmail}`);
              } else {
                await Linking.openURL(
                  `https://mail.google.com/compose?to=${supportEmail}`
                );
              }
            } catch (e) {}
          }}
        >
          <Text
            style={{
              color: "white",
              opacity: 0.8,
              flexWrap: "wrap",
              textAlign: "left",
              marginLeft: 10,
            }}
            selectable={true}
          >
            If the issue persists, Please! Email at : tcanjb@gmail.com
          </Text>
          <Feather name={"external-link"} size={20} color={"white"} />
        </TouchableOpacity>
      </View>
    </BackgroundImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: "5%",
    alignItems: "center",
  },
  errorIcon: {
    width: "80%",
    height: "50%",
    resizeMode: "contain",
  },
  errorTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    marginHorizontal: 20,
    flexWrap: "wrap",
    color: "white",
  },
  retryButtonTxt: {
    fontSize: 20,
    color: "white",
    marginRight: 10,
  },
  retryButton: {
    flexDirection: "row",
    backgroundColor: "red",
    padding: 10,
    borderRadius: 10,
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ErrorScreen;
