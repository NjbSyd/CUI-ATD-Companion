import NetInfo from "@react-native-community/netinfo";
import {
  clearTimetableTable,
  insertOrUpdateTimetableDataInBatch,
} from "../SQLiteFunctions";
import axios from "axios";
import { fakeSleep, RemoveLabData } from "../../UI/Functions/UIHelpers";
import {
  setFreeslots,
  setFreeslotsAvailable,
} from "../../Redux/FreeslotsSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const Timetable_API_URL =
  "http://cui-unofficial.eastus.cloudapp.azure.com:3000/timetable";
const FreeSlots_API_URL =
  "http://cui-unofficial.eastus.cloudapp.azure.com:3000/freeslots";

// Function to check if an update is needed
async function shouldUpdateDataFromServer() {
  try {
    const lastSyncDate = await AsyncStorage.getItem("lastSyncDate");

    if (!lastSyncDate) {
      return true;
    }

    const currentDate = new Date();
    const lastSyncDateObj = new Date(lastSyncDate);

    if (
      currentDate.getDate() > lastSyncDateObj.getDate() &&
      currentDate.getHours() >= 7
    ) {
      return await askForDataUpdatePermission();
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
}

// Function to update data and sync date
async function updateDataFromServerIfNeeded(setLoadingText) {
  if (setLoadingText === undefined) {
    setLoadingText = () => {};
  }
  try {
    const updateNeeded = await shouldUpdateDataFromServer();
    if (updateNeeded) {
      const isConnected = (await NetInfo.fetch()).isInternetReachable;
      if (!isConnected) {
        throw new Error(
          "Please! Check your internet connection and try again."
        );
      }
      setLoadingText("Fetching Data ...");
      const timetableData = await fetchDataFromMongoDB(Timetable_API_URL);
      if (
        timetableData.title &&
        timetableData?.title.toUpperCase().includes("UPDATE")
      ) {
        return timetableData;
      }
      setLoadingText("Removing Old Data...");
      await fakeSleep(100);
      await clearTimetableTable();
      setLoadingText("Removing Old Data...✅");
      await fakeSleep(500);
      await insertOrUpdateTimetableDataInBatch(timetableData);
      await AsyncStorage.setItem("lastSyncDate", new Date().toJSON());
    } else {
      setLoadingText("Proceeding with existing data...");
      await fakeSleep(1000);
    }
    return "NoError";
  } catch (error) {
    setLoadingText("Error Occurred⛔");
    throw new Error("Please! Restart the App or Try Again.");
  }
}

async function fetchDataFromMongoDB(URL) {
  try {
    const res = await axios.get(URL);
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function fetchAndStoreFreeslotsData(StateDispatcher) {
  try {
    const isConnected = (await NetInfo.fetch()).isInternetReachable;
    if (!isConnected) {
      alert("No internet connection.");
      return;
    }
    const res = await fetchDataFromMongoDB(FreeSlots_API_URL);
    const freeslots = RemoveLabData(res);

    StateDispatcher(setFreeslots(freeslots));
    StateDispatcher(setFreeslotsAvailable(true));

    return true;
  } catch (error) {
    throw error;
  }
}

async function askForDataUpdatePermission() {
  return new Promise((resolve) => {
    Alert.alert(
      "Data Update Permission",
      "Existing data might be outdated. Do you want to update it?",
      [
        {
          text: "Yes",
          onPress: () => resolve(true), // User grants permission
        },
        {
          text: "No",
          onPress: () => resolve(false), // User declines permission
        },
      ],
      { cancelable: false }
    );
  });
}

export {
  shouldUpdateDataFromServer,
  updateDataFromServerIfNeeded,
  fetchAndStoreFreeslotsData,
};
