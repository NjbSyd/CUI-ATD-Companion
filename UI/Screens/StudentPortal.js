import { Alert, StyleSheet, ToastAndroid, View } from "react-native";
import WebView from "react-native-webview";
import React, { useRef, useState } from "react";
import {
  CheckCurrentPageScript,
  DownloadProfileImage,
  LoginScript,
} from "../Functions/UIHelpers";
import { LinearProgress } from "@rneui/themed";
import { DeleteUserCredentialsFromDB } from "../../BackEnd/SQLiteSearchFunctions";

export default function StudentPortal({ route, navigation }) {
  const [progress, setProgress] = useState(0);
  const [progressFinished, setProgressFinished] = useState(false);
  const [navigationCounter, setNavigationCounter] = useState(0);
  const webViewRef = useRef(null);
  let { id, pass } = route.params;
  id = id.split("-");

  function handleLoadingEndEvent() {
    webViewRef.current.injectJavaScript(CheckCurrentPageScript());
    if (navigationCounter <= 0) {
      console.log("If condition navigation counter is", navigationCounter);
      webViewRef.current.injectJavaScript(LoginScript(id, pass));
      setNavigationCounter(navigationCounter + 1);
    } else {
      setNavigationCounter(navigationCounter + 1);
    }
    setProgress(0);
    setProgressFinished(true);
  }

  const handleOnMessageEvent = async (event) => {
    try {
      const currentPage = event.nativeEvent.data;
      if (navigationCounter >= 2) {
        if (currentPage === "https://sis.cuiatd.edu.pk/login.aspx") {
          await DeleteUserCredentialsFromDB(id.join("-"));
          Alert.alert(
            "Login Failed",
            "Please check your Registration No. and Password!",
            ["OK"],
            { cancelable: true }
          );
          navigation.navigate("Login");
        } else {
          await DownloadProfileImage(id.join("-"));
        }
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {!progressFinished && <LinearProgress value={progress} color="primary" />}
      <WebView
        ref={(ref) => {
          webViewRef.current = ref;
        }}
        onLoadStart={() => {
          setProgress(0);
          setProgressFinished(false);
        }}
        onLoadProgress={({ nativeEvent }) => {
          setProgress(nativeEvent.progress);
        }}
        onLoadEnd={handleLoadingEndEvent}
        source={{ uri: "https://sis.cuiatd.edu.pk/login.aspx" }}
        onMessage={handleOnMessageEvent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  buttonBar: {
    flexDirection: "row",
    margin: 10,
  },
});
