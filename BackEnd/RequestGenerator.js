import axios from "axios";
import { initializeDatabase, insertOrUpdateData } from "./SQLiteFunctions";
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

async function fetchDataAndStore(setLoadingText, StateDispatcher) {
  try {
    console.error("\n\nFetching Data\n\n");
    const isConnected = (await NetInfo.fetch()).isInternetReachable;
    if (!isConnected) {
      setLoadingText("No Internet Connection");
      return;
    }
    await initializeDatabase();
    setLoadingText("Fetching Data ...");
    const data = await getDataFromDB();
    for (const element of data) {
      insertOrUpdateData(element);
    }
    setLoadingText("Getting some things Ready...");
    await GetClassRooms().then((res) => {
      StateDispatcher(setClassRoom(res));
      setLoadingText("Getting some things Ready...Classrooms✅");
    });
    await GetTimeSlots().then((res) => {
      StateDispatcher(setTimeslot(res));
      setLoadingText("Getting some things Ready...Timeslots✅");
    });
    await GetTeacherNames().then((res) => {
      StateDispatcher(setTeacherNames(res));
      setLoadingText("Getting some things Ready...Teachers✅");
    });
    await GetSubjectNames().then((res) => {
      StateDispatcher(setSubjectNames(res));
      setLoadingText("Getting some things Ready...Subjects✅");
    });
    setLoadingText("Data Updated");
  } catch (error) {
    console.error(error);
    setLoadingText("Error Occurred");
    throw error;
  }
}

// async function fetchDataAndStore(setLoadingText, hasInternet) {
//   try {
//     if (!hasInternet) {
//       setLoadingText("No Internet Connection");
//       return;
//     }
//     await initializeDatabase();
//     setLoadingText("Checking Data in Device...");
//     const DateExists = await checkInKeys("Date");
//     if (!DateExists) {
//       setLoadingText("Fetching Data from Server...");
//       const res = await getDataFromDB();
//       res.forEach((element) => {
//         insertOrUpdateData(element);
//       });
//       setLoadingText("Storing Data in Device...");
//       await setData("Date", JSON.stringify(Date.now()));
//       setLoadingText("Data Updated");
//     } else {
//       setLoadingText("Checking for Updates...");
//       let DateToday = new Date(Date.now());
//       let DateStored = await getData("Date");
//       DateStored = new Date(DateStored);
//       if (DateToday.getDate() > DateStored.getDate()) {
//         setLoadingText("Updating Data from Server...");
//         const res = await getDataFromDB();
//         res.forEach((element) => {
//           insertOrUpdateData(element);
//         });
//         setLoadingText("Storing Updated Data in Device...");
//         await setData("Date", JSON.stringify(Date.now()));
//       } else {
//         setLoadingText("Data is Up to Date");
//       }
//     }
//   } catch (error) {
//     console.error(error);
//     setLoadingText("Error Occured");
//     throw error;
//   }
// }

export { fetchDataAndStore, getDataFromDB };
