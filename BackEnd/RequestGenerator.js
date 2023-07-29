import axios from "axios";
import NetInfo from "@react-native-community/netinfo";
import {
  GetClassRooms,
  GetDataSyncDate,
  GetSubjectNames,
  GetTeacherNames,
  GetTimeSlots,
} from "./SQLiteSearchFunctions";
import { setTeacherNames } from "../Redux/TeacherSlice";
import { setClassRoom } from "../Redux/ClassRoomSlice";
import { setSubjectNames } from "../Redux/SubjectSlice";
import { setTimeslot } from "../Redux/TimeslotSlice";
import {
  insertOrUpdateData,
  initializeDatabase,
  insertOrUpdateDataSyncDate,
  createDataSyncDateTable,
} from "./SQLiteFunctions";
import { shouldReloadData } from "./Helpers";

const API_URL = "https://timetable-scrapper.onrender.com/timetable";

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
    setLoadingText("Checking for Updates ...");
    createDataSyncDateTable();
    const DataSyncDate = await GetDataSyncDate();
    const shouldReload = shouldReloadData(DataSyncDate);
    if (!shouldReload) {
      insertOrUpdateDataSyncDate(new Date().toLocaleString());
      await fetchLocalData(setLoadingText, StateDispatcher);
      return;
    }
    const isConnected = (await NetInfo.fetch()).isInternetReachable;
    if (!isConnected) {
      setLoadingText("No Internet Connection😢");
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
    insertOrUpdateDataSyncDate(new Date().toJSON());
  } catch (error) {
    console.log(error);
    setLoadingText("Error Occurred");
    throw error;
  }
}

async function fetchLocalData(setLoadingText, StateDispatcher) {
  try {
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

    setLoadingText("Data Updated from Local Storage");
    insertOrUpdateDataSyncDate(new Date().toJSON());
  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
}

export { fetchDataAndStore };
