import { FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { CheckBox } from "@rneui/themed";
import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
  Alert,
  ScrollView,
  Keyboard,
} from "react-native";
import { Avatar, Button, TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import { updateUserCredentialsState } from "../../BackEnd/DataHandlers/FrontEndDataHandler";
import { insertOrUpdateUserCredentials } from "../../BackEnd/SQLiteFunctions";
import {
  DeleteUserCredentialsFromDB,
  GetUserCredentialsByRegistrationNumber,
} from "../../BackEnd/SQLiteSearchFunctions";
import Theme from "../Constants/Theme";

const LoginScreen = ({ navigation }) => {
  const StateDispatcher = useDispatch();
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboardOpen(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardOpen(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  useFocusEffect(
    useCallback(() => {
      updateUserCredentialsState(StateDispatcher)
        .then(() => {})
        .catch((error) => {
          console.error("Error occurred:", error);
        });
    }, [])
  );
  const users = useSelector((state) => state.StudentCredentialsSlice.users);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  let [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [editSavedUsers, setEditSavedUsers] = useState(false);
  const handleLogin = async () => {
    if (username === "" || password === "") {
      ToastAndroid.show("Please fill all the fields!", ToastAndroid.SHORT);
      return;
    }
    if (username.split("-").length !== 3) {
      ToastAndroid.show("Invalid Registration No!", ToastAndroid.SHORT);
      return;
    }
    username = username.toUpperCase().trim();
    if (rememberMe) {
      await insertOrUpdateUserCredentials(username, password);
    } else {
      Alert.alert(
        "Credentials Not Saved⛔",
        "You opted to NOT save credentials, But it is recommended for ease of use in the future.",
        ["Ok"],
        { cancelable: true }
      );
    }
    const id = username,
      pass = password;
    setUsername("");
    setPassword("");
    setRememberMe(true);
    setShowPassword(false);
    setEditSavedUsers(false);
    navigation.navigate("Portal", { id, pass });
  };

  const handleUsernameChange = (text) => {
    if (text.length > 12) {
      return;
    }
    text = text.toUpperCase();
    if (text.length === 5 || text.length === 9) {
      if (text[text.length - 1] !== "-")
        text = text.slice(0, -1) + "-" + text.slice(-1);
    }
    setUsername(text.toUpperCase());
  };

  const handleSavedUserLogin = async (user) => {
    if (editSavedUsers) {
      DeleteUserCredentialsFromDB(user.label)
        .then(() => {
          updateUserCredentialsState(StateDispatcher)
            .then(() => {})
            .catch((error) => {
              console.error("Error occurred:", error);
            });
        })
        .catch((error) => {
          console.error("Error occurred:", error);
        });
    } else {
      GetUserCredentialsByRegistrationNumber(user.label).then((res) => {
        setUsername(res.RegistrationNumber);
        setPassword(res.Password);
        setRememberMe(true);
        setShowPassword(false);
        console.log(res);
        navigation.navigate("Portal", {
          id: res.RegistrationNumber,
          pass: res.Password,
          img: res.Image,
        });
      });
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <Text style={styles.title}>Welcome Back!</Text>
        <TextInput
          label={"Registration No"}
          placeholder="FA20-BSE-023"
          placeholderTextColor={"lightgrey"}
          cursorColor="#000"
          value={username}
          onChangeText={handleUsernameChange}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.input}
          mode="outlined"
          right={
            <TextInput.Icon
              name="eye"
              size={24}
              style={{
                marginTop: 10,
              }}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
        />
        <CheckBox
          checked={rememberMe}
          center
          onPress={() => setRememberMe(!rememberMe)}
          title="Remember Me"
          checkedColor="#674FA3"
          style={styles.rememberMe}
        />
        <Button
          mode="elevated"
          contentStyle={{ height: 50 }}
          labelStyle={{ fontWeight: "bold", fontSize: 20 }}
          style={{
            width: "60%",
          }}
          onPress={handleLogin}
          width="60%"
        >
          Login
        </Button>
      </View>
      {users.length !== 0 && users[0].label !== "null" && !isKeyboardOpen && (
        <ScrollView
          style={{
            flex: 1,
          }}
          contentContainerStyle={styles.savedUsersOuterContainer}
        >
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.savedUsersLabel}>Saved Users:</Text>
            <TouchableOpacity
              onPress={() => setEditSavedUsers(!editSavedUsers)}
            >
              <FontAwesome5
                name={editSavedUsers ? "check" : "edit"}
                size={24}
                color="#4CAF50"
              />
            </TouchableOpacity>
          </View>
          {users.map((user, i) => (
            <TouchableOpacity
              key={i}
              style={{
                margin: 5,
                alignItems: "center",
              }}
              onPress={() => handleSavedUserLogin(user)}
            >
              {user.image !== "null" ? (
                <Avatar.Image size={50} source={{ uri: user.image }} />
              ) : (
                <Avatar.Text
                  size={50}
                  label={user.label.split("-")[2]}
                  color="white"
                  style={{
                    backgroundColor: "#3e7fbd",
                  }}
                />
              )}
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 12,
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                {user.label}
              </Text>
              {editSavedUsers && (
                <FontAwesome5
                  name="trash"
                  size={24}
                  color="red"
                  style={styles.deleteSavedUserBtn}
                />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: Theme.ScreenWidth * 0.85,
    height: Theme.ScreenWidth / 8,
    marginBottom: Theme.SIZES.BASE,
  },
  showPasswordButton: {
    marginLeft: 5,
    textAlign: "center",
    textAlignVertical: "center",
    marginBottom: "5%",
  },
  showPasswordButtonText: {
    color: "#4CAF50",
  },
  rememberMe: {
    marginVertical: 10,
  },
  button: {
    width: "60%",
    height: 50,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  slotSelector: {
    width: "95%",
    padding: 10,
    marginTop: 10,
    borderWidth: 0.3,
    borderColor: "#000",
    borderRadius: 5,
  },
  slotOptionsContainer: {
    borderColor: "#000",
    borderWidth: 0.3,
    borderRadius: 5,
  },
  slotSearch: {
    backgroundColor: "#000",
    color: "#fff",
    letterSpacing: 1,
    borderRadius: 5,
    height: 60,
  },
  savedUsersOuterContainer: {
    flex: 1,
    height: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "80%",
    alignItems: "center",
  },
  loginContainer: {
    flex: 1.5,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  savedUsersLabel: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    width: "60%",
  },
  deleteSavedUserBtn: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});

export default LoginScreen;
