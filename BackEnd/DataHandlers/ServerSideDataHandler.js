import NetInfo from "@react-native-community/netinfo";
import {
  clearTimetableTable,
  insertOrUpdateTimetableData,
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
      console.log("No last sync date found, updating...");
      return true;
    }

    const currentDate = new Date();
    const lastSyncDateObj = new Date(lastSyncDate);

    if (
      currentDate.getDate() > lastSyncDateObj.getDate() &&
      currentDate.getHours() >= 7
    ) {
      console.log("Data is outdated, updating...");
      return await askForDataUpdatePermission();
    } else {
      console.log("Data is up to date");
      return false;
    }
  } catch (error) {
    console.error("Error checking data update status:", error);
    throw error;
  }
}

// Function to update data and sync date
async function updateDataFromServerIfNeeded(setLoadingText) {
  if (setLoadingText === undefined) {
    setLoadingText = () => {};
  }
  try {
    console.log("Checking if data update is needed...");
    const updateNeeded = await shouldUpdateDataFromServer();

    if (updateNeeded) {
      const isConnected = (await NetInfo.fetch()).isInternetReachable;
      if (!isConnected) {
        setLoadingText("No Internet Connection😢");
        return;
      }
      setLoadingText("Fetching Data ...");
      const timetableData = await fetchDataFromMongoDB(Timetable_API_URL);
      await fakeSleep(1000);
      setLoadingText("Removing Old Data...");
      await clearTimetableTable();
      await fakeSleep(1000);
      let done = 0;
      const total = timetableData.length;
      setLoadingText(`Setting Up New Data...`);
      for (let element of timetableData) {
        element.subject = cleanup(element.subject);
        await insertOrUpdateTimetableData(element);
        ++done;
        await fakeSleep(1);
        setLoadingText(
          `Setting Up New Data... ${done}/${total}✅\nDon't worry! this will happen just this once`
        );
      }

      await AsyncStorage.setItem("lastSyncDate", new Date().toJSON());

      setLoadingText("Data Updated from Server");
    } else {
      setLoadingText("Proceeding with existing data...");
    }
  } catch (error) {
    console.error("Error updating data from server:", error);
    setLoadingText("Error Occurred⛔");
    throw error;
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
      console.warn("No internet connection. Free-slot data not updated.");
      return;
    }

    const res = await fetchDataFromMongoDB(FreeSlots_API_URL);
    const freeslots = RemoveLabData(res);

    StateDispatcher(setFreeslots(freeslots));
    StateDispatcher(setFreeslotsAvailable(true));

    return true;
  } catch (error) {
    console.error("Error fetching free-slot data from MongoDB:", error);
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

// Helper function to clean up the input fields from the html tags, special characters and extra spaces.
function cleanup(inputString) {
  return inputString
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/&[^;]+;/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}
