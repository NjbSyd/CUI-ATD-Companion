import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  Alert,
  Button,
} from "react-native";
import { CheckBox } from "@rneui/themed";
import { insertOrUpdateUserCredentials } from "../../BackEnd/SQLiteFunctions";
import { useDispatch, useSelector } from "react-redux";
import { GetUserCredentialsByRegistrationNumber } from "../../BackEnd/SQLiteSearchFunctions";
import { UpdateUserCredentialsState } from "../../BackEnd/RequestGenerator";
import { useFocusEffect } from "@react-navigation/native";

const LoginScreen = ({ navigation }) => {
  const StateDispatcher = useDispatch();
  useFocusEffect(
    useCallback(() => {
      UpdateUserCredentialsState(StateDispatcher)
        .then(() => {})
        .catch((error) => {
          console.error("Error occurred:", error);
        });
      console.log(users);
    }, [])
  );
  let users = useSelector((state) => state.StudentCredentialsSlice.users);
  let [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

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
        ["OK"],
        { cancelable: true }
      );
    }
    let id = username,
      pass = password;
    setUsername("");
    setPassword("");
    setRememberMe(true);
    setShowPassword(false);
    navigation.navigate("Portal", { id, pass });
  };

  return (
    <View style={styles.container}>
      {users.length !== 0 && users[0].label !== "null" && (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-around",
            width: "80%",
            alignItems: "center",
            marginTop: "20%",
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              marginBottom: 20,
              color: "#333",
              width: "100%",
            }}
          >
            Saved Users:
          </Text>
          {users.map((user, i) => (
            <Button
              key={i}
              title={user.label}
              color={"blue"}
              onPress={() => {
                GetUserCredentialsByRegistrationNumber(user.label).then(
                  (res) => {
                    setUsername(res.RegistrationNumber);
                    setPassword(res.Password);
                    setRememberMe(true);
                    setShowPassword(false);
                    navigation.navigate("Portal", {
                      id: res.RegistrationNumber,
                      pass: res.Password,
                    });
                  }
                );
              }}
            >
              {user.label}
            </Button>
          ))}
        </View>
      )}
      <View
        style={{
          flex: 2,
          width: "100%",
          justifyContent: "flex-start",
          alignItems: "center",
          marginTop: "20%",
        }}
      >
        <Text style={styles.title}>Welcome Back!</Text>
        <TextInput
          placeholder="Registration No: FA20-BSE-023"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Your Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.input}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.showPasswordButton}
          >
            <Text style={styles.showPasswordButtonText}>
              {showPassword ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>
        </View>
        <CheckBox
          checked={rememberMe}
          center
          onPress={() => setRememberMe(!rememberMe)}
          title="Remember Me"
          checkedTitle="You're Remembered!"
          style={styles.rememberMe}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "80%",
    height: 40,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
  },
  passwordContainer: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
});

export default LoginScreen;
