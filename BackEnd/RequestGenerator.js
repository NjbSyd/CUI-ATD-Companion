import axios from "axios";
import { initializeDatabase, insertOrUpdateData } from "./SQLiteFunctions";
import {
  GetClassRooms,
  GetTeacherNames,
  GetTimeSlots,
} from "./SQLiteSearchFunctions";
import { checkInKeys, getData, setData } from "./AsyncStorageFunctions";

async function getDataFromDB() {
  try {
    const { API_URL } = require("./my.secrets.json");
    const res = await axios.get(API_URL);
    return res.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

async function fetchDataAndStore() {
  try {
    await initializeDatabase();
    const DateExists = await checkInKeys("Date");
    if (!DateExists) {
      console.log("Fetching fresh data from API");
      const res = await getDataFromDB();
      res.forEach((element) => {
        insertOrUpdateData(element);
      });
      await setData("Date", JSON.stringify(Date.now()));
    } else {
      let DateToday = new Date(Date.now());
      let DateStored = await getData("Date");
      DateStored = new Date(DateStored);
      if (DateToday.getDate() > DateStored.getDate()) {
        console.log("Refreshing data from API");
        const res = await getDataFromDB();
        res.forEach((element) => {
          insertOrUpdateData(element);
        });
        await setData("Date", JSON.stringify(Date.now()));
      } else {
        console.log("Data is up to date");
      }
    }
    const teachers = await GetTeacherNames().catch((e) => console.log(e));
    const classRooms = await GetClassRooms().catch((e) => console.log(e));
    const timeSlots = await GetTimeSlots().catch((e) => console.log(e));
    return { teachers, classRooms, timeSlots };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export { fetchDataAndStore, getDataFromDB };
