import axios from "axios";
import { initializeDatabase, insertOrUpdateData } from "./SQLiteFunctions";
import { checkInKeys, getData, setData } from "./AsyncStorageFunctions";

async function getDataFromDB() {
  try {
    const API_URL = "http://35.202.88.20:3000/timetable";
    const res = await axios.get(API_URL);
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function fetchDataAndStore(setLoadingText) {
  try {
    await initializeDatabase();
    setLoadingText("Checking Data in Device...");
    const DateExists = await checkInKeys("Date");
    if (!DateExists) {
      setLoadingText("Fetching Data from Server...");

      const res = await getDataFromDB();
      res.forEach((element) => {
        insertOrUpdateData(element);
      });
      setLoadingText("Storing Data in Device...");
      await setData("Date", JSON.stringify(Date.now()));
      setLoadingText("Data Updated");
    } else {
      setLoadingText("Checking for Updates...");
      let DateToday = new Date(Date.now());
      let DateStored = await getData("Date");
      DateStored = new Date(DateStored);
      if (DateToday.getDate() > DateStored.getDate()) {
        setLoadingText("Updating Data from Server...");
        const res = await getDataFromDB();
        res.forEach((element) => {
          insertOrUpdateData(element);
        });
        setLoadingText("Storing Updated Data in Device...");
        await setData("Date", JSON.stringify(Date.now()));
      } else {
        setLoadingText("Data is Up to Date");
      }
    }
  } catch (error) {
    console.error(error);
    setLoadingText("Error Occured");
    throw error;
  }
}

export { fetchDataAndStore, getDataFromDB };
