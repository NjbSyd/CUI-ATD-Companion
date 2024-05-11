import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { Alert } from "react-native";

import { DigitalOceanAPI } from "./APIs";
import {
  setFreeslots,
  setFreeslotsAvailable,
} from "../../Redux/FreeslotsSlice";
import { fakeSleep, RemoveLabData } from "../../UI/Functions/UIHelpers";
import {
  clearTimetableTable,
  insertOrUpdateTimetableDataInBatch,
} from "../KnexDB";

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
      const res = await DigitalOceanAPI.post(`timetable/shouldUpdate`, {
        lastSyncDate,
      });
      const data = {
        shouldUpdate: undefined,
        lastScrapDate: undefined,
        title: undefined,
      };
      data.shouldUpdate = res.data.shouldUpdate;
      data.lastScrapDate = res.data.lastScrapDate;
      data.title = res.data.title;
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
          "Please! Check your internet connection and try again.",
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
      await fakeSleep(100);
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
        "Server Connection Timeout...⛔\nProceeding with existing data...",
      );
      return "NoError";
    } else {
      throw new Error("Please! Restart the App or Try Again.");
    }
  }
}

async function fetchDataFromMongoDB(URL) {
  try {
    const res = await DigitalOceanAPI.get(URL);
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
        .trim()} has some changes,\nDo you want to update it?`,
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
      { cancelable: false },
    );
  });
}

export {
  shouldUpdateDataFromServer,
  updateDataFromServerIfNeeded,
  fetchAndStoreFreeslotsData,
};
