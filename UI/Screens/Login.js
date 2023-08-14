import React, {useCallback, useEffect, useState} from "react";
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity, ToastAndroid, Alert, ScrollView, KeyboardAvoidingView, Keyboard
} from "react-native";
import {CheckBox} from "@rneui/themed";
import {insertOrUpdateUserCredentials} from "../../BackEnd/SQLiteFunctions";
import {useDispatch, useSelector} from "react-redux";
import {DeleteUserCredentialsFromDB, GetUserCredentialsByRegistrationNumber} from "../../BackEnd/SQLiteSearchFunctions";
import {UpdateUserCredentialsState} from "../../BackEnd/RequestGenerator";
import {useFocusEffect} from "@react-navigation/native";
import {Avatar} from "react-native-paper";
import BannerAds from "../../Ads/BannerAd";
import {FontAwesome5} from "@expo/vector-icons";

const LoginScreen = ({navigation}) => {
  const StateDispatcher = useDispatch();
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardOpen(true);
    });

    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardOpen(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  useFocusEffect(useCallback(() => {
    UpdateUserCredentialsState(StateDispatcher)
    .then(() => {
    })
    .catch((error) => {
      console.error("Error occurred:", error);
    });
  }, []));
  let users = useSelector((state) => state.StudentCredentialsSlice.users);
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
      Alert.alert("Credentials Not Saved⛔", "You opted to NOT save credentials, But it is recommended for ease of use in the future.", ["OK"], {cancelable: true});
    }
    let id = username, pass = password;
    setUsername("");
    setPassword("");
    setRememberMe(true);
    setShowPassword(false);
    setEditSavedUsers(false)
    navigation.navigate("Portal", {id, pass});
  };

  const handleSavedUserLogin = async (user) => {
    if (editSavedUsers) {
      DeleteUserCredentialsFromDB(user.label).then(() => {
        UpdateUserCredentialsState(StateDispatcher)
        .then(() => {})
        .catch((error) => {
          console.error("Error occurred:", error);
        });
      }).catch((error) => {
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
          id: res.RegistrationNumber, pass: res.Password,
        });
      });
    }
  }
  return (<View style={styles.container}>
    <View style={styles.loginContainer}>
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
    {users.length !== 0 && users[0].label !== "null" && !isKeyboardOpen && (<ScrollView
        style={{
          flex: 1,
        }}
        contentContainerStyle={styles.savedUsersOuterContainer}
    >
      <View style={{
        width: "100%", flexDirection: "row", justifyContent: "space-between",
      }}>
        <Text style={styles.savedUsersLabel}>Saved Users:</Text>
        <TouchableOpacity onPress={() => setEditSavedUsers(!editSavedUsers)}>
          <FontAwesome5 name={editSavedUsers ? "check" : "edit"} size={24} color="#4CAF50"/>
        </TouchableOpacity>
      </View>
      {users.map((user, i) => (<TouchableOpacity
          key={i}
          style={{
            margin: 5, alignItems: "center",
          }}
          onPress={() => handleSavedUserLogin(user)}
      >
        {user.image !== "null" ? (<Avatar.Image size={50} source={{uri: user.image}}/>) : (<Avatar.Text
            size={50}
            label={user.label.split("-")[2]}
            color={"white"}
            style={{
              backgroundColor: "#3e7fbd",
            }}
        />)}
        <Text style={{
          textAlign: "center", fontSize: 12, fontWeight: "bold", color: "#333",
        }}>{user.label}</Text>
        {editSavedUsers && (
            <FontAwesome5 name="trash" size={24} color="red" style={styles.deleteSavedUserBtn}/>)}
      </TouchableOpacity>))}
    </ScrollView>)}
    <BannerAds/>
  </View>);
};

const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: "center", backgroundColor: "#f8f8f8",
  }, title: {
    fontSize: 32, fontWeight: "bold", marginBottom: 20, color: "#333",
  }, input: {
    width: "80%", height: 40, borderRadius: 8, borderColor: "#ccc", borderWidth: 1, padding: 10, marginBottom: 15,
  }, passwordContainer: {
    width: "80%", flexDirection: "row", alignItems: "center", justifyContent: "space-between",
  }, showPasswordButton: {
    marginLeft: 5, textAlign: "center", textAlignVertical: "center", marginBottom: "5%",
  }, showPasswordButtonText: {
    color: "#4CAF50",
  }, rememberMe: {
    marginVertical: 10,
  }, button: {
    width: "60%",
    height: 50,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  }, buttonText: {
    color: "white", fontWeight: "bold", fontSize: 18,
  }, slotSelector: {
    width: "95%", padding: 10, marginTop: 10, borderWidth: 0.3, borderColor: "#000", borderRadius: 5,
  }, slotOptionsContainer: {
    borderColor: "#000", borderWidth: 0.3, borderRadius: 5,
  }, slotSearch: {
    backgroundColor: "#000", color: "#fff", letterSpacing: 1, borderRadius: 5, height: 60,
  }, savedUsersOuterContainer: {
    flex: 1,
    height: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "80%",
    alignItems: "center",
  }, loginContainer: {
    flex: 1.5, width: "100%", justifyContent: "center", alignItems: "center", marginTop: "20%",
  }, savedUsersLabel: {
    fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#333", width: "60%",
  }, deleteSavedUserBtn: {
    position: "absolute", top: 0, left: 0,
  },
});

export default LoginScreen;
