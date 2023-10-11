import React, { useCallback } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  Linking,
  ToastAndroid,
  BackHandler,
  TouchableOpacity,
  View,
} from "react-native";
import { Block, Text, theme, Button as GaButton } from "galio-framework";
import nowTheme from "../Constants/Theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import Theme from "../Constants/Theme";
const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

const ProfileScreen = ({ navigation }) => {
  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", () => {
        navigation.navigate("Home");
        return true;
      });
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", () => {
          navigation.navigate("Home");
          return true;
        });
    }, [])
  );
  return (
    <Block
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Block
        flex
        style={{
          padding: theme.SIZES.BASE,
          marginTop: height * 0.05,
          marginBottom: height * 0.005,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={true}>
          <Block flex>
            <Block middle>
              <Text
                style={{
                  color: "#2c2c2c",
                  marginTop: 15,
                  zIndex: 2,
                  fontFamily: "montserrat-bold",
                  marginBottom: theme.SIZES.BASE / 2,
                  fontWeight: "900",
                  fontSize: 26,
                  letterSpacing: 2,
                }}
              >
                About the App
              </Text>
              <Text
                size={16}
                muted
                style={{
                  textAlign: "left",
                  fontFamily: "montserrat-regular",
                  zIndex: 2,
                  lineHeight: 25,
                  color: "#9A9A9A",
                  paddingHorizontal: Theme.SIZES.BASE * 0.8,
                }}
              >
                The CUIATD Companion App provides a simple and efficient way to
                manage your class schedules. Built with expertise in React
                Native and Web technologies, it offers a user-friendly interface
                for navigating timetables, browsing university portal, exploring
                classroom, teacher, and subject-based schedules with ease.
              </Text>
            </Block>
          </Block>
          <View
            style={{
              marginTop: Theme.SIZES.BASE,
              borderBottomColor: "#000",
              borderBottomWidth: 0.5,
            }}
          />
          <Block flex>
            <Block middle>
              <Text
                style={{
                  color: "#2c2c2c",
                  marginTop: 15,
                  zIndex: 2,
                  fontFamily: "montserrat-bold",
                  marginBottom: theme.SIZES.BASE / 2,
                  fontWeight: "900",
                  fontSize: 26,
                  letterSpacing: 2,
                  paddingHorizontal: Theme.SIZES.BASE * 0.8,
                }}
              >
                Privacy Policy
              </Text>
              <Text
                size={16}
                muted
                style={{
                  textAlign: "left",
                  fontFamily: "montserrat-regular",
                  zIndex: 2,
                  lineHeight: 25,
                  color: "#9A9A9A",
                  paddingHorizontal: 15,
                }}
              >
                This app does not collect, store, or share any personal
                information. Any login credentials saved are stored locally on
                your device for your convenience. This app doesn't integrate
                with third-party services which might collect your data. Your
                data security is the priority. For any inquiries, contact us.
              </Text>
            </Block>
          </Block>
          <View
            style={{
              marginTop: Theme.SIZES.BASE,
              borderBottomColor: "#000",
              borderBottomWidth: 0.5,
            }}
          />
          <Block flex>
            <Block middle>
              <Text
                style={{
                  color: "#2c2c2c",
                  marginTop: 15,
                  zIndex: 2,
                  fontFamily: "montserrat-bold",
                  marginBottom: theme.SIZES.BASE / 2,
                  fontWeight: "900",
                  fontSize: 26,
                  letterSpacing: 2,
                }}
              >
                Data Source
              </Text>
              <Text
                size={16}
                muted
                style={{
                  textAlign: "left",
                  fontFamily: "montserrat-regular",
                  zIndex: 2,
                  lineHeight: 25,
                  color: "#9A9A9A",
                  paddingHorizontal: Theme.SIZES.BASE * 0.8,
                }}
              >
                The data used in this app is sourced from the official CUI
                Administration website. Specifically, it is obtained from the
                CUI Timetable page. Please note that this app is an independent
                project and is not officially supported or endorsed by the
                university. We adhere to ethical practices in software
                development and respect intellectual property rights.
              </Text>
            </Block>
          </Block>
          <View
            style={{
              marginTop: Theme.SIZES.BASE,
              borderBottomColor: "#000",
              borderBottomWidth: 0.5,
            }}
          />
          <Block
            flex
            style={{
              marginTop: theme.SIZES.BASE / 2,
            }}
          >
            <Block middle>
              <Text
                style={{
                  fontFamily: "montserrat-bold",
                  marginBottom: theme.SIZES.BASE / 2,
                  fontWeight: "900",
                  fontSize: 26,
                  letterSpacing: 2,
                }}
                color="#000"
              >
                Contributors
              </Text>
            </Block>
            <Block
              row={true}
              style={{ justifyContent: "center", marginBottom: 5 }}
            >
              <TouchableOpacity
                onPress={() => {
                  try {
                    Linking.openURL("https://github.com/NjbSyd");
                  } catch (e) {
                    ToastAndroid.show(e.message, ToastAndroid.SHORT);
                  }
                }}
              >
                <Image
                  source={{
                    uri: "https://avatars.githubusercontent.com/u/95611072?v=4",
                  }}
                  style={styles.avatar}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  try {
                    Linking.openURL("https://github.com/Nawaz393");
                  } catch (e) {
                    ToastAndroid.show(e.message, ToastAndroid.SHORT);
                  }
                }}
              >
                <Image
                  source={{
                    uri: "https://avatars.githubusercontent.com/u/91367891?v=4",
                  }}
                  style={styles.avatar}
                />
              </TouchableOpacity>
            </Block>
          </Block>
          <Block
            flex
            style={{
              marginTop: theme.SIZES.BASE / 2,
            }}
          >
            <Block middle>
              <Text
                style={{
                  fontFamily: "montserrat-bold",
                  fontWeight: "900",
                  fontSize: 20,
                  letterSpacing: 2,
                }}
                color="#000"
              >
                Get In Touch
              </Text>
            </Block>
            <Block
              row={true}
              style={{
                justifyContent: "center",
                marginBottom: 5,
              }}
            >
              <GaButton
                round
                onlyIcon
                shadowless
                icon="linkedin"
                iconFamily="Entypo"
                iconColor={nowTheme.COLORS.WHITE}
                iconSize={nowTheme.SIZES.BASE * 1.375}
                color={"#00a7ff"}
                style={[styles.social, styles.shadow]}
                onPress={() => {
                  try {
                    Linking.openURL(
                      "https://play.google.com/store/apps/dev?id=5430143247484849184"
                    );
                  } catch (e) {
                    ToastAndroid.show(e.message, ToastAndroid.SHORT);
                  }
                }}
              />
              <GaButton
                round
                shadowless
                iconColor={nowTheme.COLORS.WHITE}
                iconSize={nowTheme.SIZES.BASE * 1.375}
                color={"#ea4335"}
                style={[styles.social, styles.shadow]}
                onPress={() => {
                  try {
                    Linking.openURL("mailto:tcanjb@gmail.com");
                  } catch (e) {
                    ToastAndroid.show(e.message, ToastAndroid.SHORT);
                  }
                }}
              >
                <MaterialCommunityIcons
                  name={"gmail"}
                  size={nowTheme.SIZES.BASE * 1.375}
                  color={"#fff"}
                />
              </GaButton>
              <GaButton
                round
                onlyIcon
                shadowless
                icon="google-play"
                iconFamily="Entypo"
                iconColor={nowTheme.COLORS.WHITE}
                iconSize={nowTheme.SIZES.BASE * 1.375}
                color={"#4285f4"}
                style={[styles.social, styles.shadow]}
                onPress={() => {
                  try {
                    Linking.openURL(
                      "https://play.google.com/store/apps/dev?id=5430143247484849184"
                    );
                  } catch (e) {
                    ToastAndroid.show(e.message, ToastAndroid.SHORT);
                  }
                }}
              />
            </Block>
          </Block>
        </ScrollView>
      </Block>

      <GaButton
        round
        onlyIcon
        shadowless
        icon="back"
        iconFamily="AntDesign"
        iconColor={nowTheme.COLORS.WHITE}
        iconSize={nowTheme.SIZES.BASE * 1.375}
        color={"#4c5054"}
        style={{
          position: "absolute",
          marginTop: height * 0.05,
          height: "5%",
          width: "15%",
        }}
        onPress={() => {
          navigation.navigate("Home");
        }}
      />
    </Block>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    width,
    height,
    padding: 0,
    zIndex: 1,
  },
  profileBackground: {
    width,
    height: height * 0.43,
    backgroundColor: "#000",
    opacity: 0.7,
  },
  info: {
    marginTop: 30,
    paddingHorizontal: 10,
    height: height * 0.8,
  },
  avatar: {
    width: thumbMeasure * 0.6,
    height: thumbMeasure * 0.6,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: "#000",
    marginHorizontal: 10,
  },
  nameInfo: {
    marginTop: 35,
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure,
  },
  social: {
    width: nowTheme.SIZES.BASE * 3,
    height: nowTheme.SIZES.BASE * 3,
    borderRadius: nowTheme.SIZES.BASE * 1.5,
    justifyContent: "center",
    zIndex: 99,
    marginHorizontal: 5,
  },
});

export default ProfileScreen;
