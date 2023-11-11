import NetInfo from "@react-native-community/netinfo";
import * as Application from "expo-application";
import {
  clearTimetableTable,
  insertOrUpdateTimetableDataInBatch,
} from "../SQLiteFunctions";
import { fakeSleep, RemoveLabData } from "../../UI/Functions/UIHelpers";
import {
  setFreeslots,
  setFreeslotsAvailable,
} from "../../Redux/FreeslotsSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import axios from "axios";

const api1 = axios.create({
  baseURL: "https://timetable-scrapper.onrender.com/",
  timeout: 30000,
});
const api2 = axios.create({
  baseURL: "https://www.server.m-nawa-z-khan.rocks/",
  timeout: 10000,
});
const API = [api2, api1];

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
      let res;
      for (let i = 0; i < API.length; i++) {
        try {
          res = await API[i].post(`timetable/shouldUpdate`, {
            lastSyncDate,
            version: Application.nativeApplicationVersion,
          });
          if (res) {
            break;
          }
        } catch (e) {
          if (i === API.length - 1) {
            throw e;
          }
        }
      }
      const data = res?.data;

      if (data?.shouldUpdate) {
        return await askForDataUpdatePermission(data?.lastScrapDate);
      }
      if (data?.title?.toUpperCase().includes("UPDATE")) {
        return data;
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
    if (updateNeeded?.title?.toUpperCase().includes("UPDATE")) {
      return updateNeeded;
    }
    if (updateNeeded) {
      const isConnected = (await NetInfo.fetch()).isInternetReachable;
      if (!isConnected) {
        throw new Error(
          "Please! Check your internet connection and try again."
        );
      }
      setLoadingText("Fetching Data ...");
      const timetableData = await fetchDataFromMongoDB("timetable");
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
    let res;
    for (let i = 0; i < API.length; i++) {
      res = await API[i].get(URL, {
        params: {
          version: Application.nativeApplicationVersion,
        },
      });
      if (res) {
        break;
      }
    }
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
    const res = await fetchDataFromMongoDB("freeslots");
    if (res.title && res.title.toUpperCase().includes("UPDATE")) {
      console.log(res);
      return res;
    }
    const freeslots = RemoveLabData(res);
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
