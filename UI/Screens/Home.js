import React, { useCallback, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Alert,
  BackHandler,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

const Main = ({ navigation }) => {
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          "Exit App",
          "Are you sure you want to exit?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Exit", onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: false }
        );
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );
  const screenWidth = Dimensions.get("window").width;
  const buttonsPerRow = 2;
  const buttonWidth = screenWidth / buttonsPerRow - 20;

  const renderButton = (iconName, screenName, screenDescription) => {
    return (
      <TouchableOpacity
        style={[styles.button, { width: buttonWidth }]}
        onPress={() => navigation.navigate(screenName)}
      >
        <FontAwesome5 name={iconName} size={50} color="white" />
        <Text style={styles.buttonText}>{screenName}</Text>
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontSize: 10,
            margin: 20,
          }}
        >
          {screenDescription}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.space} />
      <View style={styles.buttonContainer}>
        {renderButton(
          "chalkboard-teacher",
          "Teachers",
          "See a Teacher's schedule"
        )}
        {renderButton(
          "university",
          "Classrooms",
          "Search details based on RoomNo & TimeSlot"
        )}
        {renderButton(
          "book",
          "Subjects",
          "Check assigned Teachers for a Subject"
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  space: {
    height: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    width: "100%",
    marginTop: 10,
    flex: 2,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(15, 44, 76)",
    marginVertical: 10,
    borderRadius: 10,
    height: "35%",
    borderColor: "rgb(15, 44, 76)",
    borderWidth: 1,
  },
  buttonText: {
    color: "white",
    marginTop: 20,
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Main;
