import {
  GetClassNames,
  GetClassRooms,
  GetSubjectNames,
  GetTeacherNames,
  GetTimeSlots,
  GetUsers,
} from "../SQLiteSearchFunctions";
import { setClassRoom } from "../../Redux/ClassRoomSlice";
import { setTimeslot } from "../../Redux/TimeslotSlice";
import { setTeacherNames } from "../../Redux/TeacherSlice";
import { setSubjectNames } from "../../Redux/SubjectSlice";
import { setClassNames } from "../../Redux/SectionSlice";
import { setRegistration } from "../../Redux/StudentCredentialsSlice";
import { createUserCredentialsTable } from "../SQLiteFunctions";

async function fetchDataFromSQLite(StateDispatcher) {
  try {
    const classRooms = await GetClassRooms();
    StateDispatcher(setClassRoom(classRooms));

    const timeSlots = await GetTimeSlots();
    StateDispatcher(setTimeslot(timeSlots));

    const teacherNames = await GetTeacherNames();
    StateDispatcher(setTeacherNames(teacherNames));

    const subjectNames = await GetSubjectNames();
    StateDispatcher(setSubjectNames(subjectNames));

    const sectionNames = await GetClassNames();
    StateDispatcher(setClassNames(sectionNames));

    await updateUserCredentialsState(StateDispatcher);
    return true;
  } catch (error) {
    console.error("Error fetching data from SQLite:", error);
    throw error;
  }
}

async function updateUserCredentialsState(StateDispatcher) {
  try {
    let users = await GetUsers();
    if (users.length === 0) {
      StateDispatcher(setRegistration([{ label: "null", image: "null" }]));
      return;
    }
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

export { fetchDataFromSQLite, updateUserCredentialsState };
