import {configureStore, combineReducers} from "@reduxjs/toolkit";
import ClassRoomSlice from "./ClassRoomSlice";
import TeacherSlice from "./TeacherSlice";
import SubjectSlice from "./SubjectSlice";
import TimeslotSlice from "./TimeslotSlice";
import SectionSlice from "./SectionSlice";
import StudentCredentialsSlice from "./StudentCredentialsSlice";
import FreeslotsSlice from "./FreeslotsSlice";

const rootReducer = combineReducers({
  ClassRoomSlice,
  TimeslotSlice,
  SubjectSlice,
  TeacherSlice,
  SectionSlice,
  StudentCredentialsSlice,
  FreeslotsSlice,
});
export const MyStore = configureStore({
  reducer: rootReducer,
});
