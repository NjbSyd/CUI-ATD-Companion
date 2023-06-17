import axios from "axios";
import { initializeDatabase, insertOrUpdateData } from "./SQLiteFunctions";
import {
  GetClassRooms,
  GetTeacherNames,
  GetTimeSlots,
} from "../Functions/functions";
import { setTeacherNames } from "../Redux/Reducers/TeachersReducer";
import { setClassRoomNames } from "../Redux/Reducers/ClassRoomsReducer";
import { setTimeSlots } from "../Redux/Reducers/TimeSlotsReducer";

async function getDataFromDB() {
  try {
    const { API_URL } = require("./my.secrets.json");
    const res = await axios.get(API_URL);
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function fetchDataAndStore() {
  try {
    await initializeDatabase();
    const res = await getDataFromDB();
    res.forEach((element) => {
      insertOrUpdateData(element);
    });
    const teachers = await GetTeacherNames();
    const classRooms = await GetClassRooms();
    const timeSlots = await GetTimeSlots();
    console.log("Data fetched and stored successfully");
    return { teachers, classRooms, timeSlots };
  } catch (error) {
    throw error;
  }
}

export { fetchDataAndStore, getDataFromDB };
