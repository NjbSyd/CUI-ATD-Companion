import React from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  StatusBar,
  Linking,
  ToastAndroid,
} from "react-native";
import { Block, Text, theme, Button as GaButton } from "galio-framework";
import nowTheme from "../Constants/Theme";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";

export const StatusHeight = StatusBar.currentHeight;

const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

const ProfileScreen = ({ navigation }) => {
  return (
    <Block
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Block flex={0.4}>
        <ImageBackground
          source={require("../../assets/Images/me-bg.jpg")}
          style={styles.profileContainer}
          imageStyle={styles.profileBackground}
        >
          <Block flex>
            <Block
              style={{
                position: "absolute",
                width: width,
                height: height * 0.6,
                zIndex: 5,
                paddingHorizontal: 20,
              }}
            >
              <Block middle style={{ top: height * 0.15 }}>
                <Image
                  source={require("../../assets/Images/me.png")}
                  style={styles.avatar}
                />
              </Block>
              <Block style={{ top: height * 0.2 }}>
                <Block middle>
                  <Text
                    style={{
                      fontFamily: "montserrat-bold",
                      marginBottom: theme.SIZES.BASE / 2,
                      fontWeight: "900",
                      fontSize: 26,
                      letterSpacing: 2,
                    }}
                    color="#ffffff"
                  >
                    Najeeb Sayed
                  </Text>
                  <Text
                    size={16}
                    color="white"
                    style={{
                      marginTop: 5,
                      fontFamily: "montserrat-bold",
                      lineHeight: 20,
                      fontWeight: "bold",
                      fontSize: 18,
                      opacity: 0.8,
                    }}
                  >
                    Developer
                  </Text>
                </Block>
              </Block>
            </Block>

            <Block
              middle
              row
              style={{
                position: "absolute",
                width: width,
                top: height * 0.6 - height * 0.2,
                zIndex: 99,
              }}
            >
              <GaButton
                round
                onlyIcon
                shadowless
                icon="github"
                iconFamily="AntDesign"
                iconColor={nowTheme.COLORS.WHITE}
                iconSize={nowTheme.SIZES.BASE * 1.375}
                color={"#4c5054"}
                style={[styles.social, styles.shadow]}
                onPress={() => {
                  try {
                    Linking.openURL("https://github.com/NjbSyd");
                  } catch (e) {
                    ToastAndroid.show(e.message, ToastAndroid.SHORT);
                  }
                }}
              />
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
              <GaButton
                round
                shadowless
                iconColor={nowTheme.COLORS.WHITE}
                iconSize={nowTheme.SIZES.BASE * 1.375}
                color={"#25d366"}
                style={[styles.social, styles.shadow]}
                onPress={() => {
                  try {
                    Linking.openURL(
                      "https://api.whatsapp.com/send/?phone=923439555964&text=Hey!%20I%20want%20to%20ask%20about%20CUIATD%20Companion."
                    );
                  } catch (e) {
                    ToastAndroid.show(e.message, ToastAndroid.SHORT);
                  }
                }}
              >
                <FontAwesome
                  name={"whatsapp"}
                  size={nowTheme.SIZES.BASE * 1.375}
                  color={"#fff"}
                />
              </GaButton>
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
            </Block>
          </Block>
        </ImageBackground>
      </Block>
      <Block />
      <Block
        flex={0.7}
        style={{ padding: theme.SIZES.BASE, marginTop: height * 0.15 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Block flex style={{ marginTop: 20 }}>
            <Block middle>
              <Text
                style={{
                  color: "#2c2c2c",
                  fontWeight: "bold",
                  fontSize: 19,
                  fontFamily: "montserrat-bold",
                  marginTop: 15,
                  zIndex: 2,
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
                  paddingHorizontal: 15,
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
          <Block flex>
            <Block middle>
              <Text
                style={{
                  color: "#2c2c2c",
                  fontWeight: "bold",
                  fontSize: 19,
                  fontFamily: "montserrat-bold",
                  marginTop: 15,
                  zIndex: 2,
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
          <Block flex>
            <Block middle>
              <Text
                style={{
                  color: "#2c2c2c",
                  fontWeight: "bold",
                  fontSize: 19,
                  fontFamily: "montserrat-bold",
                  marginTop: 15,
                  zIndex: 2,
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
                  paddingHorizontal: 15,
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
  avatarContainer: {
    position: "relative",
    marginTop: -80,
  },
  avatar: {
    width: thumbMeasure,
    height: thumbMeasure,
    borderRadius: 50,
    borderWidth: 0,
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
