import { Alert, BackHandler } from "react-native";

function LoginScript(id, pass) {
  return `
  try {
  if (document.URL === "https://sis.cuiatd.edu.pk/login.aspx") {
    const delay = 1000;

    const closePopupButton = document.querySelector("#cboxClose");
    setTimeout(() => {
      closePopupButton.click();
      window.ReactNativeWebView.postMessage("Automatically Entering Saved Details...");
    }, delay);

    setTimeout(() => {
      const sessionDropdown = document.querySelector("#ddl_Session");
      const sessionIndex = [...sessionDropdown.options].findIndex((option) => option.text === "${id[0]}");
      sessionDropdown.selectedIndex = sessionIndex;
      sessionDropdown.onchange();
    }, delay * 2);

    setTimeout(() => {
      const programDropdown = document.querySelector("#ddl_Program");
      const programIndex = [...programDropdown.options].findIndex((option) => option.text === "${id[1]}");
      programDropdown.selectedIndex = programIndex;
      programDropdown.onchange();
    }, delay * 3);

    setTimeout(() => {
      const rollNoInput = document.querySelector("#txt_RollNo");
      rollNoInput.value = "${id[2]}";
      rollNoInput.onkeyup();
    }, delay * 4);

    setTimeout(() => {
      const passwordInput = document.querySelector("#txt_Password");
      passwordInput.value = "${pass}";
      window.ReactNativeWebView.postMessage("Logging In...");
    }, delay * 5);

    setTimeout(() => {
      const signInButton = document.querySelector("#btn_StudentSignIn");
      signInButton.click();
    }, delay * 6);
  }
} catch (error) {
  alert(error.message);
}
  `;
}

function CheckCurrentPageScript() {
  return `
  current=document.URL;
  if(current!=="https://sis.cuiatd.edu.pk/login.aspx"){
  document.getElementById("profile-links").style.display="none";
  }
    window.ReactNativeWebView.postMessage(current);
  `;
}

const handleBackPress = () => {
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

export { LoginScript, handleBackPress, CheckCurrentPageScript };
