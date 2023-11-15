import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useCallback, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  Image,
  Linking,
  ToastAndroid,
  BackHandler,
  TouchableOpacity,
  View,
  Text,
} from "react-native";

import Theme from "../Constants/Theme";

const ProfileScreen = ({ navigation }) => {
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <></>,
      headerTitleStyle: [styles.title, { color: "#7c47d9" }],
      headerTitle: "About the App",
    });
  }, []);
  const handleBackPress = () => {
    navigation.navigate("Home");
    return true;
  };

  useCallback(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackPress);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.text}>
            The CUIATD Companion App provides a simple and efficient way to
            manage your class schedules. Built with expertise in React Native
            and Web technologies, it offers a user-friendly interface for
            navigating timetables, browsing university portal, exploring
            classroom, teacher, and subject-based schedules with ease.
          </Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.section}>
          <Text style={[styles.title, { color: "#00a7ff" }]}>
            Privacy Policy
          </Text>
          <Text style={styles.text}>
            This app does not collect, store, or share any personal information.
            Any login credentials saved are stored locally on your device for
            your convenience.{" "}
            <Text
              style={styles.linkText}
              onPress={() => {
                Linking.openURL(
                  "https://njbsyd.github.io/CUI-ATD-Companion/",
                ).then(() => {});
              }}
            >
              Read more
            </Text>{" "}
          </Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.section}>
          <Text style={[styles.title, { color: "#EA4335" }]}>Data Source</Text>
          <Text style={styles.text}>
            The data used in this app is sourced from the official CUI
            Administration website . Specifically, it is obtained from the{" "}
            <Text
              style={styles.linkText}
              onPress={() => {
                Linking.openURL(
                  "https://cuonline.cuiatd.edu.pk/Timetable/Timetable.aspx",
                ).then(() => {});
              }}
            >
              CUI Timetable
            </Text>{" "}
            page. Please note that this app is an independent project and is not
            officially supported or endorsed by the university. We adhere to
            ethical practices in software development and respect intellectual
            property rights.
          </Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.section}>
          <Text style={styles.title}>Contributors</Text>
          <View style={styles.avatarContainer}>
            <TouchableOpacity
              onPress={() => {
                try {
                  Linking.openURL("https://github.com/NjbSyd").then(() => {});
                } catch (e) {
                  ToastAndroid.show(e.message, ToastAndroid.SHORT);
                }
              }}
            >
              <Image
                source={{
                  uri: "https://avatars.githubusercontent.com/u/95611072?v=4",
                }}
                style={[
                  styles.avatar,
                  {
                    width: Theme.SIZES.BASE * 3.5,
                    aspectRatio: 1,
                    borderRadius: Theme.SIZES.BASE * 1.75,
                  },
                ]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                try {
                  Linking.openURL("https://github.com/Nawaz393").then(() => {});
                } catch (e) {
                  ToastAndroid.show(e.message, ToastAndroid.SHORT);
                }
              }}
            >
              <Image
                source={{
                  uri: "https://avatars.githubusercontent.com/u/91367891?v=4",
                }}
                style={[
                  styles.avatar,
                  {
                    width: Theme.SIZES.BASE * 3.5,
                    aspectRatio: 1,
                    borderRadius: Theme.SIZES.BASE * 1.75,
                  },
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.separator} />
        <View style={styles.section}>
          <Text style={styles.title}>Get In Touch</Text>
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={[
                styles.avatar,
                { backgroundColor: "#00a7ff", borderColor: "#00a7ff" },
              ]}
              onPress={() => {
                try {
                  Linking.openURL(
                    "https://www.linkedin.com/in/najeeb-said-170477234/",
                  ).then(() => {});
                } catch (e) {
                  ToastAndroid.show(e.message, ToastAndroid.SHORT);
                }
              }}
            >
              <MaterialCommunityIcons
                name="linkedin"
                size={Theme.SIZES.BASE * 2}
                color="#fff"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.avatar,
                { backgroundColor: "#ea4335", borderColor: "#ea4335" },
              ]}
              onPress={() => {
                try {
                  Linking.openURL("mailto:tcanjb@gmail.com").then(() => {});
                } catch (e) {
                  ToastAndroid.show(e.message, ToastAndroid.SHORT);
                }
              }}
            >
              <MaterialCommunityIcons
                name="gmail"
                size={Theme.SIZES.BASE * 2}
                color="#fff"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.avatar,
                { backgroundColor: "#4285f4", borderColor: "#4285f4" },
              ]}
              onPress={() => {
                try {
                  Linking.openURL(
                    "https://play.google.com/store/apps/dev?id=5430143247484849184",
                  ).then(() => {});
                } catch (e) {
                  ToastAndroid.show(e.message, ToastAndroid.SHORT);
                }
              }}
            >
              <MaterialCommunityIcons
                name="google-play"
                size={Theme.SIZES.BASE * 2}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: Theme.COLORS.WHITE,
  },
  section: {
    padding: Theme.ScreenWidth * 0.05,
  },
  title: {
    fontFamily: "montserrat-bold",
    fontSize: 26,
    letterSpacing: 2,
    marginBottom: Theme.ScreenWidth * 0.025,
  },
  text: {
    fontFamily: "montserrat-regular",
    lineHeight: 25,
    color: "#000",
  },
  separator: {
    borderBottomColor: Theme.COLORS.GITHUB,
    borderBottomWidth: 0.5,
  },

  avatarContainer: {
    flexDirection: "row",
    marginBottom: 5,
  },
  avatar: {
    width: Theme.SIZES.BASE * 3,
    aspectRatio: 1,
    borderRadius: Theme.SIZES.BASE * 1.5,
    borderWidth: 1.5,
    borderColor: "#000",
    marginHorizontal: Theme.SIZES.BASE * 0.6,
    alignItems: "center",
    justifyContent: "center",
  },
  socialContainer: {
    flexDirection: "row",
    marginBottom: 5,
  },
  linkText: {
    color: "blue",
    textDecorationLine: "underline",
    textDecorationColor: "blue",
    fontWeight: "bold",
  },
});

export default ProfileScreen;
