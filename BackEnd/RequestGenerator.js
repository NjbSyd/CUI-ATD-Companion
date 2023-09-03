import axios from "axios";
import NetInfo from "@react-native-community/netinfo";
import {
  GetClassNames,
  GetClassRooms,
  GetDataSyncDate,
  GetSubjectNames,
  GetTeacherNames,
  GetTimeSlots,
  GetUsers,
} from "./SQLiteSearchFunctions";
import { setTeacherNames } from "../Redux/TeacherSlice";
import { setClassRoom } from "../Redux/ClassRoomSlice";
import { setSubjectNames } from "../Redux/SubjectSlice";
import { setTimeslot } from "../Redux/TimeslotSlice";
import {
  createDataSyncDateTable,
  createUserCredentialsTable,
  createTimetableDataTable,
  insertOrUpdateTimetableData,
  insertOrUpdateDataSyncDate,
  clearTimetableTable,
  clearDataSyncDateTable,
} from "./SQLiteFunctions";
import { shouldReloadData } from "./Helpers";
import { setClassNames } from "../Redux/SectionSlice";
import { setRegistration } from "../Redux/StudentCredentialsSlice";
import { setFreeslots, setFreeslotsAvailable } from "../Redux/FreeslotsSlice";
import { RemoveLabData } from "../UI/Functions/UIHelpers";

const Timetable_API_URL =
  "http://cui-unofficial.eastus.cloudapp.azure.com:3000/timetable";
const FreeSlots_API_URL =
  "http://cui-unofficial.eastus.cloudapp.azure.com:3000/freeslots";

const LOADING_MESSAGES = {
  FETCHING: "Please Wait...",
  UPDATING: "Updating...",
  ERROR: "Error Occurred",
  NO_CONNECTION: "No Internet Connection",
  READY: "Getting some things Ready...",
};

async function updateLoadingText(text, setLoadingText) {
  if (setLoadingText) {
    setLoadingText(text);
  }
}

const setTimedLoadingText = (text, delay, setLoadingText) => {
  setTimeout(async () => {
    await updateLoadingText(text, setLoadingText);
  }, delay);
};

async function FetchTimetableDataFromMongoDB(setLoadingText) {
  try {
    const res = await axios.get(Timetable_API_URL);
    return res.data;
  } catch (e) {
    throw e;
  }
}

async function FetchFreeslotsDataFromMongoDB(StateDispatcher, setLoadingText) {
  if (setLoadingText === undefined) {
    setLoadingText = () => {};
  }
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await updateLoadingText(LOADING_MESSAGES.FETCHING, setLoadingText);
    const res = await axios.get(FreeSlots_API_URL);
    const freeslots = RemoveLabData(res.data);
    await updateLoadingText(LOADING_MESSAGES.UPDATING, setLoadingText);
    StateDispatcher(setFreeslots(freeslots));
    StateDispatcher(setFreeslotsAvailable(true));
    await updateLoadingText(LOADING_MESSAGES.READY, setLoadingText);
  } catch (e) {
    await updateLoadingText(LOADING_MESSAGES.ERROR, setLoadingText);
    alert(
      "Error Occurred while fetching freeslots from server\nPlease check your internet connection"
    );
  }
}

async function PopulateGlobalState(setLoadingText, StateDispatcher) {
  try {
    await createDataSyncDateTable();
    await createTimetableDataTable();
    await createUserCredentialsTable();
    const DataSyncDate = await GetDataSyncDate();
    const shouldReload = shouldReloadData(DataSyncDate);
    if (!shouldReload) {
      await FetchDataFromSQLite(setLoadingText, StateDispatcher, "Local Cache");
      return;
    }
    const isConnected = (await NetInfo.fetch()).isInternetReachable;
    if (!isConnected) {
      setLoadingText("No Internet Connection😢");
      await FetchDataFromSQLite(setLoadingText, StateDispatcher, "Local Cache");
      return;
    }
    setTimedLoadingText(LOADING_MESSAGES.FETCHING, 4000, setLoadingText);
    setTimedLoadingText(LOADING_MESSAGES.UPDATING, 10000, setLoadingText);
    setTimedLoadingText(LOADING_MESSAGES.READY, 15000, setLoadingText);
    setLoadingText("Fetching Data ...");
    const data = await FetchTimetableDataFromMongoDB(setLoadingText);
    setLoadingText("Removing Old Data...");
    await clearTimetableTable();
    for (const element of data) {
      await insertOrUpdateTimetableData(element);
    }
    await clearDataSyncDateTable();
    await insertOrUpdateDataSyncDate(new Date().toJSON());
    await FetchDataFromSQLite(setLoadingText, StateDispatcher, "Remote Server");
  } catch (error) {
    console.error(error);
    setLoadingText("Error Occurred⛔");
    throw error;
  }
}

async function UpdateUserCredentialsState(StateDispatcher, setLoadingText) {
  try {
    let users = await GetUsers();
    if (users.length === 0) {
      setLoadingText
        ? setLoadingText("Getting some things Ready...Users❌")
        : null;
      StateDispatcher(setRegistration([{ label: "null", image: "null" }]));
      return;
    }
    setLoadingText
      ? setLoadingText("Getting some things Ready...Users✅")
      : null;
    let usernames = [];

    for (let i = 0; i < users.length; i++) {
      let singleUserModel = {
        label: users[i].label,
        image: users[i].image,
      };
      usernames.push(singleUserModel);
    }
    StateDispatcher(setRegistration(usernames));
  } catch (error) {
    console.error("Error occurred:", error);
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

    await UpdateUserCredentialsState(StateDispatcher, setLoadingText);

    setLoadingText(`Data Updated from ${Mode}`);
  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
}

export {
  PopulateGlobalState,
  FetchDataFromSQLite,
  UpdateUserCredentialsState,
  FetchFreeslotsDataFromMongoDB,
};
