import { View, ToastAndroid, Button, StyleSheet } from "react-native";
import WebView from "react-native-webview";
import React, { useRef, useState } from "react";
import { LoginScript } from "../Functions/UIHelpers";
import { LinearProgress } from "@rneui/themed";

export default function StudentPortal() {
  const [progress, setProgress] = useState(0);
  const [progressFinished, setProgressFinished] = useState(false);
  const webViewRef = useRef(null);

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
        onLoadEnd={() => {
          setProgressFinished(true);
          setProgress(0);
        }}
        source={{ uri: "https://sis.cuiatd.edu.pk/login.aspx" }}
        onMessage={(event) => {
          ToastAndroid.show(event.nativeEvent.data, ToastAndroid.SHORT);
        }}
        injectedJavaScript={LoginScript(id, pass)}
      />
    </View>
  );
}
let id = "FA20-BSE-023".split("-");
let pass = "Olamba.1";

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
