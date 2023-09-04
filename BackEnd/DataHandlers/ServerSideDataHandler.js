import NetInfo from "@react-native-community/netinfo";
import {
  clearTimetableTable,
  clearDataSyncDateTable,
  createDataSyncDateTable,
  insertOrUpdateDataSyncDate,
  insertOrUpdateTimetableData,
  createTimetableDataTable,
} from "../SQLiteFunctions";
import { GetDataSyncDate } from "../SQLiteSearchFunctions";
import axios from "axios";
import { RemoveLabData } from "../../UI/Functions/UIHelpers";
import {
  setFreeslots,
  setFreeslotsAvailable,
} from "../../Redux/FreeslotsSlice";
//TODO: Resolve the following error:
// Date Based Data fetch: Error: SQLITE_ERROR: no such table: DataSyncDate
const Timetable_API_URL =
  "http://cui-unofficial.eastus.cloudapp.azure.com:3000/timetable";
const FreeSlots_API_URL =
  "http://cui-unofficial.eastus.cloudapp.azure.com:3000/freeslots";

import AsyncStorage from "@react-native-async-storage/async-storage";

// Function to check if an update is needed based on PKT (Pakistan Standard Time)
async function shouldUpdateDataFromServer() {
  try {
    // Retrieve the last sync date from AsyncStorage
    const lastSyncDate = await AsyncStorage.getItem("lastSyncDate");

    if (!lastSyncDate) {
      // If no last sync date is found, update is needed
      console.log("No last sync date found, updating...");
      return true;
    }

    // Get the current date and time in PKT (Pakistan Standard Time)
    const currentDate = new Date();
    currentDate.setUTCHours(currentDate.getUTCHours() + 5); // Adjust for PKT

    // Parse the last sync date from storage and ensure it's in PKT
    const lastSyncDateObj = new Date(lastSyncDate);
    lastSyncDateObj.setUTCHours(lastSyncDateObj.getUTCHours() + 5); // Adjust for PKT

    // Check if the date is different and it's past 7 in the morning
    if (
      currentDate.toDateString() !== lastSyncDateObj.toDateString() &&
      currentDate.getHours() >= 7
    ) {
      // Update is needed
      console.log("Data is outdated, updating...");
      return true;
    } else {
      // Data is up to date
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

      setLoadingText("Removing Old Data...");
      await clearTimetableTable();

      for (const element of timetableData) {
        await insertOrUpdateTimetableData(element);
      }

      // Update the last sync date in AsyncStorage with the current date and time in UTC
      await AsyncStorage.setItem("lastSyncDate", new Date().toJSON());

      setLoadingText("Data Updated from Server");
    } else {
      setLoadingText("Data is up to date");
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

export {
  shouldUpdateDataFromServer,
  updateDataFromServerIfNeeded,
  fetchAndStoreFreeslotsData,
};
