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
import { fetchDataFromSQLite } from "./FrontEndDataHandler";

// const Timetable_API_URL = "http://192.168.43.126:3000/timetable";
// const Timetable_API_URL = "https://www.server.m-nawa-z-khan.rocks/timetable";
// const FreeSlots_API_URL = "http://192.168.43.126:3000/freeslots";
// const FreeSlots_API_URL = "https://www.server.m-nawa-z-khan.rocks/freeslots";
const Timetable_API_URL =
  "http://cui.eastasia.cloudapp.azure.com:3000/timetable";
const FreeSlots_API_URL =
  "http://cui.eastasia.cloudapp.azure.com:3000/freeslots";

// Function to check if an update is needed
async function shouldUpdateDataFromServer() {
  try {
    const lastSyncDate = await AsyncStorage.getItem("lastSyncDate");
    if (!lastSyncDate) {
      return true;
    } else {
      if (!(await NetInfo.fetch()).isInternetReachable) {
        return false;
      }
      const { data } = await axios.post(
        encodeURI(`${Timetable_API_URL}/shouldUpdate`),
        {
          lastSyncDate,
        },
        {
          timeout: 5000,
        }
      );
      if (data?.shouldUpdate) {
        return await askForDataUpdatePermission(data?.lastScrapDate);
      }
      return false;
    }
  } catch (error) {
    const lastSyncDate = await AsyncStorage.getItem("lastSyncDate");
    if (lastSyncDate) {
      return false;
    }
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
    // const updateNeeded = true;
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
    }
    return "NoError";
  } catch (error) {
    const lastSyncDate = await AsyncStorage.getItem("lastSyncDate");
    if (error.message.toUpperCase().includes("INTERNET")) {
      throw new Error("Please! Check your internet connection and try again.");
    } else if (
      error.message.toUpperCase().includes("TIMEOUT") &&
      lastSyncDate
    ) {
      setLoadingText(
        "Server Connection Timeout...⛔\nProceeding with existing data..."
      );
      return "NoError";
    } else {
      throw new Error("Please! Restart the App or Try Again.");
    }
  }
}

async function fetchDataFromMongoDB(URL) {
  try {
    const res = await axios.get(URL, {
      timeout: 10000,
    });
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
    await fetchDataFromSQLite(StateDispatcher, ["timeslots"]);
    StateDispatcher(setFreeslots(freeslots));
    StateDispatcher(setFreeslotsAvailable(true));

    return true;
  } catch (error) {
    if (error.message.toUpperCase().includes("TIMEOUT")) {
      alert("Server is taking too long to respond.\nTry again later.");
    } else {
      throw error;
    }
  }
}

async function askForDataUpdatePermission(date) {
  return new Promise((resolve) => {
    Alert.alert(
      "Data Update Permission",
      `Data from ${new Date(date)
        .toString()
        .split("G")[0]
        .trim()} has some changes ,Do you want to update it?`,
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
