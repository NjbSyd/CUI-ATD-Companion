import { Alert, BackHandler } from "react-native";
import * as FileSystem from "expo-file-system";
import { updateImagePath } from "../../BackEnd/SQLiteFunctions";
import { useFonts } from "expo-font";

function LoginScript(id, pass) {
  return `
  try {
  if (document.URL === "https://sis.cuiatd.edu.pk/login.aspx") {
    const delay = 300;

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

function DisablePrintResultLink() {
  return `
  // document.getElementById("ctl00_DataContent_lnkPrint").style.display="none";
  document.getElementById("ctl00_DataContent_lnkPrint").target="";
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

async function CheckImageExists(regNo) {
  const imageUri = `${FileSystem.documentDirectory}/${regNo.toUpperCase()}.jpg`;
  const imageInfo = await FileSystem.getInfoAsync(imageUri);
  return imageInfo.exists;
}

async function DownloadProfileImage(regNo) {
  const imageUrl = `https://sis.cuiatd.edu.pk/PictureHandler.ashx?reg_no=CIIT/${regNo.toUpperCase()}/ATD`;
  const imagePath = await FileSystem.downloadAsync(
    imageUrl,
    `${FileSystem.documentDirectory}/${regNo.toUpperCase()}.jpg`
  );
  await updateImagePath(regNo, imagePath.uri);
}

function useCustomFonts() {
  const [fontLoaded] = useFonts({
    "yatra-one": require("../../assets/Fonts/YatraOne-Regular.ttf"),
    bricolage: require("../../assets/Fonts/BricolageGrotesque.ttf"),
    pilow: require("../../assets/Fonts/Pilowlava-Regular.otf"),
  });
  return fontLoaded;
}

function CalculateTotalFreeSlots(daySchedule, timeslot) {
  try {
    let totalFreeSlots = 0;
    for (const labSlots of Object.values(daySchedule)) {
      for (const slot of labSlots) {
        if (slot === timeslot) {
          totalFreeSlots++;
          break;
        }
      }
    }

    return totalFreeSlots;
  } catch (e) {
    return 0;
  }
}

function RemoveLabData(jsonData) {
  const result = {};

  for (const day in jsonData) {
    const dayData = jsonData[day];
    const cleanedDayData = {};

    for (const room in dayData) {
      const roomNameNormalized = room.toLowerCase();
      if (
        !roomNameNormalized.includes("lab") &&
        !roomNameNormalized.includes("(l)") &&
        !roomNameNormalized.includes("lb")
      ) {
        cleanedDayData[room] = dayData[room];
      }
    }

    result[day] = cleanedDayData;
  }

  return result;
}

function FilterFreeSlotsByTimeSlot(classSchedule, timeSlot) {
  const filteredSchedule = {};

  for (const day in classSchedule) {
    filteredSchedule[day] = {};
    for (const className in classSchedule[day]) {
      if (classSchedule[day][className].includes(timeSlot)) {
        filteredSchedule[day][className] = classSchedule[day][className];
      }
    }
  }
  return filteredSchedule;
}

async function fakeSleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Slept for ${ms} milliseconds ⏰`);
    }, ms);
  });
}
export {
  LoginScript,
  handleBackPress,
  CheckCurrentPageScript,
  DownloadProfileImage,
  useCustomFonts,
  DisablePrintResultLink,
  CheckImageExists,
  CalculateTotalFreeSlots,
  RemoveLabData,
  FilterFreeSlotsByTimeSlot,
  fakeSleep,
};
