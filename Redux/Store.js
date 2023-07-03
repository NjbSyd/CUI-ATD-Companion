import { configureStore, combineReducers } from "@reduxjs/toolkit";
import ClassRoomSlice from "./ClassRoomSlice";
import TeacherSlice from "./TeacherSlice";
import SubjectSlice from "./SubjectSlice";
import TimeslotSlice from "./TimeslotSlice";

const rootReducer = combineReducers({
  ClassRoomSlice,
  TimeslotSlice,
  SubjectSlice,
  TeacherSlice,
});
export const MyStore = configureStore({
  reducer: rootReducer,
});
