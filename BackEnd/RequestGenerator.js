import axios from "axios";
import NetInfo from "@react-native-community/netinfo";
import {
  GetClassRooms,
  GetSubjectNames,
  GetTeacherNames,
  GetTimeSlots,
} from "./SQLiteSearchFunctions";
import { setTeacherNames } from "../Redux/TeacherSlice";
import { setClassRoom } from "../Redux/ClassRoomSlice";
import { setSubjectNames } from "../Redux/SubjectSlice";
import { setTimeslot } from "../Redux/TimeslotSlice";
import { insertOrUpdateData, initializeDatabase } from "./SQLiteFunctions";

const API_URL = "http://35.202.88.20:3000/timetable";

async function getDataFromDB() {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

async function fetchDataAndStore(setLoadingText, StateDispatcher) {
  try {
    const isConnected = (await NetInfo.fetch()).isInternetReachable;
    console.log(isConnected);
    if (!isConnected) {
      setLoadingText("No Internet Connection");
      return;
    }

    setLoadingText("Initializing Database ...");
    initializeDatabase();
    setLoadingText("Database Initialized");

    setLoadingText("Fetching Data ...");
    const data = await getDataFromDB();

    for (const element of data) {
      insertOrUpdateData(element);
    }

    console.log("Data Fetched");
    setLoadingText("Getting some things Ready...");

    const classRooms = await GetClassRooms();
    StateDispatcher(setClassRoom(classRooms));
    setLoadingText("Getting some things Ready...Classrooms✅");

    const timeSlots = await GetTimeSlots();
    StateDispatcher(setTimeslot(timeSlots));
    setLoadingText("Getting some things Ready...Timeslots✅");

    const teacherNames = await GetTeacherNames();
    StateDispatcher(setTeacherNames(teacherNames));
    setLoadingText("Getting some things Ready...Teachers✅");

    const subjectNames = await GetSubjectNames();
    StateDispatcher(setSubjectNames(subjectNames));
    setLoadingText("Getting some things Ready...Subjects✅");

    setLoadingText("Data Updated");
  } catch (error) {
    console.log(error);
    setLoadingText("Error Occurred");
    throw error;
  }
}

export { fetchDataAndStore };
