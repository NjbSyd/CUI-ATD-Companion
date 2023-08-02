import axios from "axios";
import NetInfo from "@react-native-community/netinfo";
import {
  GetClassNames,
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
  createDataSyncDateTable,
  initializeDatabase,
  insertOrUpdateData,
  insertOrUpdateDataSyncDate,
} from "./SQLiteFunctions";
import { shouldReloadData } from "./Helpers";
import { ToastAndroid } from "react-native";
import { setClassNames } from "../Redux/SectionSlice";

const API_URL = "https://timetable-scrapper.onrender.com/timetable";

async function FetchDataFromMongoDB() {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (e) {
    ToastAndroid.show(e.message, ToastAndroid.SHORT);
    throw e;
  }
}

async function PopulateGlobalState(setLoadingText, StateDispatcher) {
  try {
    await createDataSyncDateTable();
    await initializeDatabase();
    const DataSyncDate = await GetDataSyncDate();
    const shouldReload = shouldReloadData(DataSyncDate);
    if (!shouldReload) {
      await FetchDataFromSQLite(setLoadingText, StateDispatcher, "Local Cache");
      return;
    }
    const isConnected = (await NetInfo.fetch()).isInternetReachable;
    if (!isConnected) {
      ToastAndroid.show(
        "No Internet Connection! Using Old Data.",
        ToastAndroid.SHORT
      );
      setLoadingText("No Internet Connection😢");
      await FetchDataFromSQLite(setLoadingText, StateDispatcher, "Local Cache");
      return;
    }
    setLoadingText("Fetching Data ...");
    const data = await FetchDataFromMongoDB();
    for (const element of data) {
      await insertOrUpdateData(element);
    }
    await insertOrUpdateDataSyncDate();
    await FetchDataFromSQLite(setLoadingText, StateDispatcher, "Remote Server");
  } catch (error) {
    console.log(error);
    setLoadingText("Error Occurred⛔");
    throw error;
  }
}

async function FetchDataFromSQLite(setLoadingText, StateDispatcher, Mode) {
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

    const sectionNames = await GetClassNames();
    StateDispatcher(setClassNames(sectionNames));
    setLoadingText("Getting some things Ready...Sections✅");

    setLoadingText(`Data Updated from ${Mode}`);
  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
}

export { PopulateGlobalState, FetchDataFromSQLite };
