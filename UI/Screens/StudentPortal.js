import { Entypo } from "@expo/vector-icons";
import { LinearProgress } from "@rneui/themed";
import React, { useRef, useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import WebView from "react-native-webview";

import { DeleteUserCredentialsFromDB } from "../../BackEnd/SQLiteSearchFunctions";
import {
  CheckCurrentPageScript,
  CheckImageExists,
  DisablePrintResultLink,
  DownloadProfileImage,
  LoginScript,
} from "../Functions/UIHelpers";

export default function StudentPortal({ route, navigation }) {
  const [progress, setProgress] = useState(0);
  const [progressFinished, setProgressFinished] = useState(false);
  const [navigationCounter, setNavigationCounter] = useState(0);
  const [event, setEvent] = useState("none");
  const webViewRef = useRef(null);
  let { id, pass, img } = route.params;
  id = id.split("-");

  const onNavigationStateChange = (navState) => {
    const url = navState.url;
    if (url !== "https://sis.cuiatd.edu.pk/login.aspx") {
      setEvent("auto");
    }
    navigation.setOptions({
      title: url,
      headerTitleStyle: {
        fontSize: 14,
      },
      headerRight: () => null,
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Login");
          }}
          style={{
            marginRight: 20,
            marginLeft: -5,
          }}
        >
          <Entypo size={28} name="cross" />
        </TouchableOpacity>
      ),
    });
  };

  function handleLoadingEndEvent() {
    webViewRef.current.injectJavaScript(CheckCurrentPageScript());
    if (navigationCounter <= 0) {
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
            { cancelable: true },
          );
          navigation.navigate("Login");
          return;
        } else if (
          currentPage === "https://sis.cuiatd.edu.pk/StudentResultCard.aspx"
        ) {
          webViewRef.current.injectJavaScript(DisablePrintResultLink());
        }
        if (img === "null" || !(await CheckImageExists(id.join("-")))) {
          await DownloadProfileImage(id.join("-"));
        }
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };
  return (
    <View
      pointerEvents={event}
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
        onNavigationStateChange={onNavigationStateChange}
        onMessage={handleOnMessageEvent}
      />
      {/*<BannerAds />*/}
    </View>
  );
}
